'use strict';
const cfg = require('../config');

/**
 * Simple bearer/service token auth for internal service-to-service calls.
 * Accepts:
 * - Authorization: Bearer <SERVICE_TOKEN>
 * If SERVICE_TOKEN is not set, the middleware allows all (dev mode).
 */
function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!required) return next();

    if (!cfg.serviceToken) {
      // No token configured -> allow in development
      return next();
    }
    if (token && token === cfg.serviceToken) return next();

    return res.status(401).json({ error: 'Unauthorized' });
  };
}

module.exports = auth;
