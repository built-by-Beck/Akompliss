import { afterAll, beforeAll, expect, it } from 'vitest';
import { buildServer } from '../src/server.js';
import type { HealthResponse } from '../src/server.js';

let app: ReturnType<typeof buildServer>;

beforeAll(async () => {
  app = buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

it('GET /health returns ok with uptime and version', async () => {
  const res = await app.inject({ method: 'GET', url: '/health' });

  expect(res.statusCode).toBe(200);

  const body = res.json<HealthResponse>();
  expect(body.status).toBe('ok');
  expect(typeof body.uptime).toBe('number');
  expect(body.uptime).toBeGreaterThanOrEqual(0);
  expect(typeof body.version).toBe('string');
});
