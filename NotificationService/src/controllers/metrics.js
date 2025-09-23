'use strict';
const notifications = require('../services/notificationService');

class MetricsController {
  // PUBLIC_INTERFACE
  get(req, res) {
    /** Returns a JSON snapshot of NotificationService metrics for monitoring systems. */
    const snapshot = notifications.metricsSnapshot();
    return res.json(snapshot);
  }
}

module.exports = new MetricsController();
