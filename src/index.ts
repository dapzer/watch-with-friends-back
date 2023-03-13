import Fastify from 'fastify';
import ws from '@fastify/websocket';

// @ts-ignore
import { websocketsRoutes } from './routes/websockets.ts';
// @ts-ignore
import { roomsRouter } from './routes/rooms.ts';

const port = 8080;

export const fastify = Fastify({});
fastify.register(ws);

fastify.register(websocketsRoutes, { prefix: 'api/ws' });
fastify.register(roomsRouter, { prefix: 'api/rooms' });

export function broadcast(message: string): void {
  // eslint-disable-next-line no-restricted-syntax
  for (const client of fastify.websocketServer.clients) {
    client.send(message);
  }
}

fastify.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
