import { FastifyInstance } from 'fastify';
// @ts-ignore
import { createRoomController, getRoomController, getRoomsController } from '../modules/rooms/rooms.controller.ts';

export const roomsRouter = async (server: FastifyInstance) => {
  server.post('/', createRoomController);
  server.get('/', getRoomsController);
  server.get('/:id', getRoomController);
};
