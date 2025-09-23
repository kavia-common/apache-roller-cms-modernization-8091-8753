'use strict';
const express = require('express');
const controller = require('../controllers/webhooks');

const router = express.Router();

/**
 * @swagger
 * /webhooks/provider:
 *   post:
 *     summary: Provider webhook callback
 *     description: Receives delivery events from external email provider (simulated).
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: string }
 *               status: { type: string }
 *               messageId: { type: string }
 *     responses:
 *       200: { description: Acknowledged }
 *       400: { description: Invalid payload }
 *       404: { description: Notification not found }
 */
router.post('/provider', controller.providerCallback.bind(controller));

/**
 * @swagger
 * /webhooks/inbound:
 *   post:
 *     summary: Inbound generic webhook
 *     description: Accepts inbound webhook for integration (internal triggers).
 *     tags: [Webhooks]
 *     responses:
 *       200: { description: Received }
 */
router.post('/inbound', controller.inbound.bind(controller));

module.exports = router;
