'use strict';
/**
 * Centralized configuration loader using environment variables.
 * Note: Do not commit .env file; supply vars via environment.
 */
require('dotenv').config();

const cfg = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',

  // Security
  jwtPublicKey: process.env.JWT_PUBLIC_KEY || '', // For bearer verification (optional for demo)
  serviceToken: process.env.SERVICE_TOKEN || '',  // Simple token for internal service auth

  // Email/Provider
  provider: process.env.EMAIL_PROVIDER || 'smtp', // smtp | mock
  defaultFrom: process.env.EMAIL_FROM || 'no-reply@example.com',

  // SMTP
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    secure: (process.env.SMTP_SECURE || 'false') === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },

  // Retry/backoff
  retry: {
    maxAttempts: parseInt(process.env.NOTIF_MAX_ATTEMPTS || '3', 10),
    baseDelayMs: parseInt(process.env.NOTIF_BASE_DELAY_MS || '500', 10),
  },

  // Template/localization
  locales: (process.env.NOTIF_LOCALES || 'en,fr,es').split(',').map(s => s.trim()),

  // ExpressBackend integration notes
  backendAudience: process.env.BACKEND_AUDIENCE || 'express-backend',
};

module.exports = cfg;
