'use strict';

/**
 * Minimal in-memory store to keep the service self-contained.
 * Replace with PostgreSQL integration in production.
 */

const notifications = new Map(); // id -> record
const attempts = new Map(); // id -> [attempts]
const auditEvents = [];
const templates = [
  { key: 'comment_moderation', locales: ['en', 'fr', 'es'] },
  { key: 'password_reset', locales: ['en'] },
  { key: 'system_alert', locales: ['en'] },
];

function addNotification(rec) {
  notifications.set(rec.id, rec);
}

function updateNotification(id, changes) {
  const prev = notifications.get(id);
  if (!prev) return;
  notifications.set(id, { ...prev, ...changes });
}

function getNotification(id) {
  return notifications.get(id);
}

function addAttempt(id, record) {
  const arr = attempts.get(id) || [];
  arr.push(record);
  attempts.set(id, arr);
}

function getAttempts(id) {
  return attempts.get(id) || [];
}

function listTemplates() {
  return templates;
}

function addAudit(event) {
  auditEvents.push(event);
}

function listAudit({ limit = 100, offset = 0 } = {}) {
  return auditEvents.slice(offset, offset + limit);
}

module.exports = {
  addNotification,
  updateNotification,
  getNotification,
  addAttempt,
  getAttempts,
  listTemplates,
  addAudit,
  listAudit,
};
