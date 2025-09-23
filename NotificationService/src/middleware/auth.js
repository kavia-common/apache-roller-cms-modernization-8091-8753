'use strict';
const cfg = require('../config');
const crypto = require('crypto');

/**
 * PUBLIC_INTERFACE
 * Role-based auth middleware.
 * Supports:
 *  - Authorization: Bearer <SERVICE_TOKEN> (grants 'service' role)
 *  - Authorization: Bearer <JWT> (when JWT_PUBLIC_KEY provided). Expects JWT with 'roles' claim (array or string).
 * If neither SERVICE_TOKEN nor JWT_PUBLIC_KEY is set, allow all (dev mode).
 */
function parseJwt(token) {
  try {
    const [hdrB64, payloadB64, sigB64] = token.split('.');
    if (!hdrB64 || !payloadB64 || !sigB64) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    // Verify signature if public key present
    if (cfg.jwtPublicKey) {
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(`${hdrB64}.${payloadB64}`);
      const ok = verifier.verify(cfg.jwtPublicKey, Buffer.from(sigB64, 'base64url'));
      if (!ok) return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function auth(required = true, requiredRoles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!required) return next();

    // Development fallback: if no configured auth at all, allow
    if (!cfg.serviceToken && !cfg.jwtPublicKey) {
      req.user = { sub: 'dev', roles: ['admin', 'service'] };
      return next();
    }

    // Service token path
    if (token && cfg.serviceToken && token === cfg.serviceToken) {
      req.user = { sub: 'service', roles: ['service'] };
      // role check
      if (requiredRoles.length && !requiredRoles.some(r => req.user.roles.includes(r))) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return next();
    }

    // JWT path
    if (token && cfg.jwtPublicKey) {
      const payload = parseJwt(token);
      if (!payload) return res.status(401).json({ error: 'Unauthorized' });
      const roles = Array.isArray(payload.roles)
        ? payload.roles
        : (payload.roles ? [payload.roles] : []);
      req.user = { sub: payload.sub || payload.user || 'unknown', roles };
      if (requiredRoles.length && !requiredRoles.some(r => roles.includes(r))) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return next();
    }

    return res.status(401).json({ error: 'Unauthorized' });
  };
}

module.exports = auth;
