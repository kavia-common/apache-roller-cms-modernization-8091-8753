'use strict';
const nodemailer = require('nodemailer');
const cfg = require('../../config');

class SmtpProvider {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: cfg.smtp.host,
      port: cfg.smtp.port,
      secure: cfg.smtp.secure,
      auth: (cfg.smtp.user && cfg.smtp.pass) ? { user: cfg.smtp.user, pass: cfg.smtp.pass } : undefined,
    });
  }

  // PUBLIC_INTERFACE
  async send({ to, from, subject, html }) {
    /** Send email via SMTP using nodemailer. */
    const info = await this.transporter.sendMail({
      to,
      from: from || cfg.defaultFrom,
      subject,
      html,
    });
    return { messageId: info.messageId || null, provider: 'smtp', raw: info };
  }
}

module.exports = new SmtpProvider();
