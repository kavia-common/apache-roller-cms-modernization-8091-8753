'use strict';
const cfg = require('../../config');
const smtpProvider = require('./smtpProvider');
const mockProvider = require('./mockApiProvider');

function getProvider() {
  switch ((cfg.provider || 'smtp').toLowerCase()) {
    case 'smtp':
      return smtpProvider;
    case 'mock':
      return mockProvider;
    default:
      return smtpProvider;
  }
}

module.exports = { getProvider };
