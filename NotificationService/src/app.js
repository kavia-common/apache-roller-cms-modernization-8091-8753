'use strict';
const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const healthController = require('./controllers/health');
const notifRoutes = require('./routes/notifications');
const webhookRoutes = require('./routes/webhooks');
const auditRoutes = require('./routes/audit');
const metricsRoutes = require('./routes/metrics');
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
    tags: [
      { name: 'Health', description: 'Health endpoints' },
      { name: 'Notifications', description: 'Templated notification APIs' },
      { name: 'Webhooks', description: 'Inbound provider/webhook endpoints' },
      { name: 'Audit', description: 'Audit log access' },
      { name: 'Monitoring', description: 'Metrics endpoints' },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Health
app.get('/', healthController.check.bind(healthController));

// Functional routes
app.use('/notifications', notifRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/audit', auditRoutes);
app.use('/metrics', metricsRoutes);

// Error handling middleware (centralized)
app.use(errorHandler);

module.exports = app;
