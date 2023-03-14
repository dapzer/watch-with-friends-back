import { FastifyReply, FastifyRequest } from 'fastify';
// @ts-ignore
import { Room, roomsList } from './data/roomsList.ts';

export const createRoomController = (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as { id: string, roomName: string };

  if (roomsList.has(data.id)) {
    reply.status(422)
      .send({
        message: `Room with id ${data.id} already exist`,
      });
  }

  roomsList.set(data.id.toString(), {
    id: data.id,
    roomName: data.roomName,
    isPlaying: false,
    src: '',
    progress: 0,
  });

  reply.status(200)
    .send({
      message: `Room with id ${data.id} successfully created`,
    });
};

export const getRoomController = (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const room = roomsList.get(id);

  if (!room) {
    reply.status(422)
      .send({ message: `Room with id ${id} not defined` });
  }

  reply.status(200)
    .send(room);
};

export const getRoomsController = (request: FastifyRequest, reply: FastifyReply) => {
  const rooms = [...roomsList.values()];

  reply.status(200)
    .send(rooms || []);
};
