'use strict';
const express = require('express');
const controller = require('../controllers/metrics');

const router = express.Router();

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Service metrics
 *     description: Returns JSON metrics snapshot for monitoring.
 *     tags: [Monitoring]
 *     responses:
 *       200: { description: Metrics JSON }
 */
router.get('/', controller.get.bind(controller));

module.exports = router;
