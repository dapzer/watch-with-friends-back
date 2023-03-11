import Fastify from 'fastify';

// @ts-ignore
import { websocketsRoutes } from './routes.ts';

const port = 8080;

export const fastify = Fastify({});

fastify.register(websocketsRoutes, { prefix: 'api' });

fastify.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
