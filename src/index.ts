import Fastify from 'fastify';
import ws from '@fastify/websocket';
import cors from '@fastify/cors';
// @ts-ignore
import { websocketsRoutes } from './routes/websockets.ts';
// @ts-ignore
import { roomsRouter } from './routes/rooms.ts';

const port = 8080;

export const fastify = Fastify({});
fastify.register(ws);
await fastify.register(cors, {
  delegator: (req, callback) => {
    const corsOptions = {
      origin: true,
    };

    if (/^localhost$/m.test(req.headers.origin!)) {
      corsOptions.origin = false;
    }

    callback(null, corsOptions);
  },
});

fastify.register(websocketsRoutes, { prefix: 'api/ws' });
fastify.register(roomsRouter, { prefix: 'api/rooms' });

fastify.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
