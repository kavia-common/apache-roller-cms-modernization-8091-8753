'use strict';

class MockApiProvider {
  // PUBLIC_INTERFACE
  async send({ to, from, subject, html }) {
    /** Mock provider: logs the message and returns a fake id. */
    const messageId = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    console.log('[MockEmailProvider] Sending', { to, from, subject, bytes: Buffer.byteLength(html || '', 'utf8') });
    return { messageId, provider: 'mock', raw: { ok: true } };
  }
}

module.exports = new MockApiProvider();
