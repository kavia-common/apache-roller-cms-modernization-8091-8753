'use strict';
const store = require('../models/store');

class WebhooksController {
  /**
   * PUBLIC_INTERFACE
   * Receive provider delivery status webhooks.
   */
  async providerCallback(req, res) {
    /** Example payload:
     * { id, status: 'delivered'|'bounced'|'opened'|'clicked', messageId? }
     */
    const { id, status, messageId } = req.body || {};
    if (!id || !status) {
      return res.status(400).json({ error: 'Missing id or status' });
    }
    const n = require('../models/store').getNotification(id);
    if (!n) return res.status(404).json({ error: 'Notification not found' });

    const now = new Date().toISOString();
    store.addAudit({ ts: now, type: 'provider_event', id, status, messageId: messageId || n.providerMessageId || null });
    res.json({ acknowledged: true });
  }

  /**
   * PUBLIC_INTERFACE
   * Receive generic inbound webhook (e.g., ExpressBackend triggers).
   */
  async inbound(req, res) {
    const payload = req.body || {};
    const now = new Date().toISOString();
    store.addAudit({ ts: now, type: 'inbound_webhook', payloadSummary: Object.keys(payload) });
    res.json({ received: true });
  }
}

module.exports = new WebhooksController();
