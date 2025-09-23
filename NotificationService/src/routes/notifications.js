'use strict';
const express = require('express');
const controller = require('../controllers/notifications');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Trigger a notification
 *     description: Send a templated, localized notification to a user or group.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipient, template, data]
 *             properties:
 *               recipient:
 *                 type: string
 *                 description: Email address or user ID
 *               template:
 *                 type: string
 *                 description: Template name or ID
 *               locale:
 *                 type: string
 *                 description: Language/locale code
 *               data:
 *                 type: object
 *                 description: Template data variables
 *     responses:
 *       200:
 *         description: Notification queued for sending
 *       400:
 *         description: Invalid request or missing data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error or email delivery failure
 */
router.post('/send', auth(true), controller.send.bind(controller));

/**
 * @swagger
 * /notifications/status/{id}:
 *   get:
 *     summary: Get notification status
 *     description: Retrieve the delivery status and logs for a specific notification.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Status and log details returned
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 */
router.get('/status/:id', auth(true), controller.status.bind(controller));

/**
 * @swagger
 * /notifications/templates:
 *   get:
 *     summary: List available templates
 *     description: Retrieve a list of available notification templates and supported locales.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of templates returned
 *       401:
 *         description: Unauthorized
 */
router.get('/templates', auth(true), controller.templates.bind(controller));

module.exports = router;
