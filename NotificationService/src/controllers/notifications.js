'use strict';
const service = require('../services/notificationService');

class NotificationsController {
  /**
   * PUBLIC_INTERFACE
   * Trigger sending a templated notification.
   */
  async send(req, res, next) {
    /** Send a templated, localized notification to a user or group.
     * Body: { recipient, template, locale?, data, channel? }
     * Returns: Notification record
     */
    try {
      const rec = await service.sendNotification(req.body);
      res.status(200).json({ status: 'queued', notification: rec });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get notification status and attempt logs.
   */
  async status(req, res, next) {
    /** Params: id
     * Returns: record + attempts
     */
    try {
      const id = req.params.id;
      const result = service.getStatus(id);
      if (!result) return res.status(404).json({ error: 'Not Found' });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * List available templates and locales.
   */
  async templates(req, res, next) {
    try {
      const list = service.listTemplates();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationsController();
