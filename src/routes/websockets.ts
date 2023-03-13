import { FastifyInstance } from 'fastify';
// @ts-ignore
import { roomsWsController } from '../modules/rooms/room.controller.ts';

export const websocketsRoutes = async (server: FastifyInstance) => {
  server.get('/:id', { websocket: true }, roomsWsController);
};
