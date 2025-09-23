# NotificationService

Templated, localized email notifications with provider adapters, audit logging, retries, and metrics.

Environment variables (example):
- PORT: 3002
- HOST: 0.0.0.0
- SERVICE_TOKEN: set a shared token for internal service-to-service calls
- JWT_PUBLIC_KEY: optional PEM public key for verifying JWTs with roles[]
- EMAIL_PROVIDER: ordered, comma-separated providers for failover (e.g., "smtp,mock")
- EMAIL_FROM: no-reply@example.com
- SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
- NOTIF_MAX_ATTEMPTS (default 3)
- NOTIF_BASE_DELAY_MS (default 500)
- NOTIF_LOCALES (default: en,fr,es)

Authentication & RBAC:
- Bearer SERVICE_TOKEN grants 'service' role (suitable for internal S2S).
- If JWT_PUBLIC_KEY is set, endpoints accept Bearer JWTs; roles are read from 'roles' claim (array/string).
- Endpoints enforce auth; templates/status require auth; metrics is public by design (can be fronted by gateway if needed).

Providers & Failover:
- Configure EMAIL_PROVIDER="smtp,mock" to try SMTP first, then mock provider upon failure within the same attempt.
- Retries use exponential backoff based on NOTIF_BASE_DELAY_MS and NOTIF_MAX_ATTEMPTS.

Key endpoints:
- GET /           Health
- POST /notifications/send            Bearer required (SERVICE_TOKEN or JWT with role)
- GET  /notifications/status/{id}     Bearer required
- GET  /notifications/templates       Bearer required
- POST /webhooks/provider             Provider callback
- POST /webhooks/inbound              Generic inbound
- GET  /audit                         Bearer required
- GET  /metrics                       Public metrics
- GET  /docs                          Swagger UI

Swagger/OpenAPI: npm run openapi:gen -> interfaces/openapi.json
