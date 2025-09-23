'use strict';
const { v4: uuidv4 } = require('uuid');
const cfg = require('../config');
const templateEngine = require('./templateEngine');
const { getProviders } = require('./providers');
const store = require('../models/store');

const metrics = {
  sent: 0,
  failed: 0,
  retries: 0,
  inFlight: 0,
  byTemplate: new Map(), // template -> count
};

function incByTemplate(template) {
  const prev = metrics.byTemplate.get(template) || 0;
  metrics.byTemplate.set(template, prev + 1);
}

function backoffDelay(attempt) {
  return cfg.retry.baseDelayMs * Math.pow(2, attempt - 1);
}

function redact(value) {
  if (!value) return value;
  const str = String(value);
  const at = str.indexOf('@');
  if (at > 1) return `${str[0]}***${str.slice(at - 1)}`;
  return str.length > 4 ? `${str.slice(0, 1)}***${str.slice(-1)}` : '***';
}

class NotificationService {
  // PUBLIC_INTERFACE
  async sendNotification({ recipient, template, locale, data, channel = 'email', id }) {
    /** Send a templated notification; returns notification record */
    if (!recipient || !template || !data) {
      const err = new Error('Missing required fields: recipient, template, data');
      err.status = 400;
      throw err;
    }
    if (channel !== 'email') {
      const err = new Error('Unsupported channel. Only email is implemented.');
      err.status = 400;
      throw err;
    }

    const notifId = id || uuidv4();
    const createdAt = new Date().toISOString();
    const rec = {
      id: notifId,
      recipient,
      template,
      locale: locale || 'en',
      data,
      channel,
      status: 'pending',
      attempts: 0,
      createdAt,
      updatedAt: createdAt,
      lastError: null,
      providerMessageId: null,
    };
    store.addNotification(rec);
    store.addAudit({
      ts: createdAt,
      type: 'notification_created',
      id: notifId,
      recipient: redact(recipient),
      template,
      locale: rec.locale,
    });

    // Async send with retry
    this._dispatch(rec.id).catch(() => { /* already logged */ });

    return rec;
  }

  async _dispatch(id) {
    const record = store.getNotification(id);
    if (!record) return;

    metrics.inFlight += 1;
    try {
      await this._attemptSend(record);
    } finally {
      metrics.inFlight = Math.max(0, metrics.inFlight - 1);
    }
  }

  async _attemptSend(record) {
    const attemptNo = record.attempts + 1;
    const now = new Date().toISOString();

    try {
      // Render localized template with fallback
      const { subject, html } = templateEngine.render(record.template, record.locale, record.data);

      // Try providers in order for failover within the same attempt
      const providers = getProviders();
      let lastError = null;
      for (const provider of providers) {
        try {
          const result = await provider.send({
            to: record.recipient,
            subject,
            html,
            from: record.data.from || undefined,
          });

          // Success
          store.addAttempt(record.id, {
            ts: now,
            outcome: 'success',
            attempt: attemptNo,
            provider: result.provider,
            messageId: result.messageId,
          });

          store.updateNotification(record.id, {
            status: 'sent',
            attempts: attemptNo,
            updatedAt: now,
            providerMessageId: result.messageId || null,
            lastError: null,
          });

          metrics.sent += 1;
          incByTemplate(record.template);
          store.addAudit({
            ts: now,
            type: 'notification_sent',
            id: record.id,
            provider: result.provider,
            messageId: result.messageId,
          });
          return; // stop after first successful provider
        } catch (provErr) {
          lastError = provErr;
          store.addAudit({
            ts: now,
            type: 'provider_failure',
            id: record.id,
            provider: provider.name || 'unknown',
            error: provErr && provErr.message ? provErr.message : String(provErr),
            attempt: attemptNo,
          });
          // continue to next provider
        }
      }

      // If we got here, all providers failed for this attempt
      throw lastError || new Error('All providers failed');
    } catch (err) {
      // Failure
      const msg = err && err.message ? err.message : String(err);
      store.addAttempt(record.id, {
        ts: now, outcome: 'failure', attempt: attemptNo, error: msg,
      });
      const shouldRetry = attemptNo < cfg.retry.maxAttempts;

      store.updateNotification(record.id, {
        status: shouldRetry ? 'retrying' : 'failed',
        attempts: attemptNo,
        updatedAt: now,
        lastError: msg,
      });

      store.addAudit({ ts: now, type: 'notification_failed', id: record.id, error: msg, attempt: attemptNo });

      if (shouldRetry) {
        metrics.retries += 1;
        const delay = backoffDelay(attemptNo);
        await new Promise(res => setTimeout(res, delay));
        return this._dispatch(record.id);
      }
      metrics.failed += 1;
      // In production, this could be published to a DLQ for manual intervention.
    }
  }

  // PUBLIC_INTERFACE
  getStatus(id) {
    /** Return a detailed status for a notification including attempts */
    const n = store.getNotification(id);
    if (!n) return null;
    return {
      ...n,
      attempts: store.getAttempts(id),
    };
  }

  // PUBLIC_INTERFACE
  listTemplates() {
    /** List available template keys and locales */
    return store.listTemplates();
  }

  // PUBLIC_INTERFACE
  metricsSnapshot() {
    /** Return a snapshot of metrics for /metrics endpoint */
    const byTemplate = {};
    for (const [k, v] of metrics.byTemplate.entries()) byTemplate[k] = v;
    return {
      sent: metrics.sent,
      failed: metrics.failed,
      retries: metrics.retries,
      inFlight: metrics.inFlight,
      byTemplate,
      timestamp: new Date().toISOString(),
      env: cfg.env,
    };
  }
}

module.exports = new NotificationService();
