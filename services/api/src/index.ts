import { buildServer } from './server.js';

const host = process.env.API_HOST ?? '0.0.0.0';
const port = Number(process.env.API_PORT ?? 3000);

const app = buildServer({ logger: true });

app
  .listen({ host, port })
  .then((address) => {
    app.log.info(`aKom-Pliss API listening on ${address}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
