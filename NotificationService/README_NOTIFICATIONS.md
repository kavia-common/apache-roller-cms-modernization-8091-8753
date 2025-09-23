# NotificationService

Templated, localized email notifications with provider adapters, audit logging, retries, and metrics.

Environment variables (example):
- PORT: 3002
- HOST: 0.0.0.0
- SERVICE_TOKEN: set a shared token for internal service-to-service calls
- EMAIL_PROVIDER: smtp | mock
- EMAIL_FROM: no-reply@example.com
- SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
- NOTIF_MAX_ATTEMPTS (default 3)
- NOTIF_BASE_DELAY_MS (default 500)
- NOTIF_LOCALES (default: en,fr,es)

Key endpoints:
- GET /           Health
- POST /notifications/send            Bearer required (SERVICE_TOKEN)
- GET  /notifications/status/{id}     Bearer required
- GET  /notifications/templates       Bearer required
- POST /webhooks/provider             Provider callback
- POST /webhooks/inbound              Generic inbound
- GET  /audit                         Bearer required
- GET  /metrics                       Public metrics
- GET  /docs                          Swagger UI

Swagger/OpenAPI: npm run openapi:gen -> interfaces/openapi.json
