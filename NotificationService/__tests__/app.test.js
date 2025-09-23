const request = require('supertest');
const app = require('../src/app');

describe('NotificationService', () => {
  it('GET /health ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/notifications/templates requires auth by default', async () => {
    const res = await request(app).get('/api/v1/notifications/templates');
    expect([401,403]).toContain(res.status);
  });

  it('POST /api/v1/notifications/send validates body', async () => {
    const res = await request(app).post('/api/v1/notifications/send').send({ recipient: 'a', template: 't' });
    expect([400,401,403]).toContain(res.status);
  });
});
