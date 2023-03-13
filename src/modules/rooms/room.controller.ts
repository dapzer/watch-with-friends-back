import { SocketStream } from '@fastify/websocket';
import { FastifyRequest } from 'fastify';
// @ts-ignore
import { broadcast } from '../../index.ts';
// @ts-ignore
import { Room, roomsList } from './data/roomsList.ts';

interface Connection {

}

const rooms = new Map();

export const roomsWsController = (connection: SocketStream, reply: FastifyRequest): void => {
  const { id: roomId } = reply.params as { id: string }; // получаем параметр из URL
  let socketId = 0;
  let room = rooms.get(roomId) || null;

  if (!roomsList.has(Number(roomId))) {
    connection.socket.send(`Room ${roomId} not found`);
    connection.socket.close();
    return;
  }

  if (rooms.has(roomId) && room) {
    socketId = room.connections.size;
    room.connections.set(socketId, connection);
  } else {
    const connections = new Map();

    connections.set(socketId, connection);
    rooms.set(roomId, { connections });
    room = rooms.get(roomId);
  }

  rooms.get(roomId).connections.forEach((ws: SocketStream) => {
    ws.socket.send(`User was connect ${socketId}`);
  });

  connection.socket.on('close', () => {
    room.connections.delete(socketId);
    room.connections.forEach((ws: SocketStream) => {
      ws.socket.send(`User disconnected ${socketId}`);
    });
  });

  connection.socket.on('message', (dto) => {
    const data = JSON.parse(dto.toString()) as Room;

    switch (data.event) {
      case 'update':
        connection.socket.send(JSON.stringify(roomsList.find((el: Room) => el.id === roomId)));
        break;
      case 'pause':
        data.isPlaying = false;
        broadcast(JSON.stringify(data));
        break;
      case 'play':
        data.isPlaying = true;
        broadcast(JSON.stringify(data));
        break;
      case 'changeProgress':
        broadcast(JSON.stringify(data));
        break;
      default:
        connection.socket.send('Event not match in list');
    }
  });
};
