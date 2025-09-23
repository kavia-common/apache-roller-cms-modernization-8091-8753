'use strict';
const express = require('express');
const controller = require('../controllers/audit');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /audit:
 *   get:
 *     summary: List audit events
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: List audit events
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth(true), controller.list.bind(controller));

module.exports = router;
