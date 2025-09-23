const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'NotificationService API',
      version: '1.0.0',
      description: 'API for triggering and managing notifications, querying status, and managing templates.',
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Inject /health doc so it appears in Swagger UI
swaggerSpec.paths = swaggerSpec.paths || {};
swaggerSpec.paths['/health'] = {
  get: {
    summary: 'Health endpoint',
    description: 'Service liveness/readiness basic check.',
    tags: ['Health'],
    responses: {
      200: {
        description: 'Service health check passed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'ok' },
                message: { type: 'string', example: 'Service is healthy' },
                timestamp: { type: 'string', format: 'date-time' },
                environment: { type: 'string', example: 'development' }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
