'use strict';
const cfg = require('../../config');
const smtpProvider = require('./smtpProvider');
const mockProvider = require('./mockApiProvider');

/**
 * PUBLIC_INTERFACE
 * Return an ordered list of providers for failover.
 * Env EMAIL_PROVIDER supports comma-separated list e.g. "smtp,mock".
 */
function getProviders() {
  const list = String(cfg.provider || 'smtp')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  const mapName = (name) => {
    switch (name) {
      case 'smtp': return smtpProvider;
      case 'mock': return mockProvider;
      default: return null;
    }
  };
  return list.map(mapName).filter(Boolean);
}

/**
 * PUBLIC_INTERFACE
 * Get a primary provider (first in list) for code paths expecting single provider.
 */
function getProvider() {
  const arr = getProviders();
  return arr.length ? arr[0] : smtpProvider;
}

module.exports = { getProvider, getProviders };
