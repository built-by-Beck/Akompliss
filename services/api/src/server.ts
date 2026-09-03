import { readFileSync } from 'node:fs';
import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  version: string;
};

export interface HealthResponse {
  status: 'ok';
  uptime: number;
  version: string;
}

/**
 * Build the aKom-Pliss API server without starting it, so tests can drive it
 * via `app.inject(...)`.
 */
export function buildServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify({ logger: false, ...opts });

  app.get(
    '/health',
    async (): Promise<HealthResponse> => ({
      status: 'ok',
      uptime: process.uptime(),
      version: pkg.version,
    }),
  );

  return app;
}
