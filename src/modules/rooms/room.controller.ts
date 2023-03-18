import { SocketStream } from '@fastify/websocket';
import { FastifyRequest } from 'fastify';
// @ts-ignore
import { Room, roomsList } from './data/roomsList.ts';

type ConnectionsList = Map<number, SocketStream>

interface Connection {
  connections: ConnectionsList;
}

const broadcast = <T>(cn: ConnectionsList | undefined, message: T): void => {
  if (!cn) return;
  cn.forEach((ws) => {
    ws.socket.send(JSON.stringify(message));
  });
};

const rooms = new Map<string, Connection>();

export const roomsWsController = (connection: SocketStream, reply: FastifyRequest<{ Params: { id: string } }>): void => {
  const { id: roomId } = reply.params; // получаем параметр из URL
  let socketId = 0;
  let room = rooms.get(roomId) || null;

  if (!roomsList.has(roomId)) {
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
    room = rooms.get(roomId)!;
  }

  broadcast(room?.connections, `User was connect ${socketId}`);

  connection.socket.on('close', () => {
    room?.connections.delete(socketId);
    broadcast(room?.connections, `User disconnected ${socketId}`);
  });

  connection.socket.on('message', (dto) => {
    const data = JSON.parse(dto.toString()) as Room;

    switch (data.event) {
      case 'update':
        connection.socket.send(JSON.stringify(roomsList.get(roomId)));
        break;
      case 'pause':
        roomsList.get(roomId).isPlaying = false;
        broadcast(room?.connections, roomsList.get(roomId));
        break;
      case 'play':
        roomsList.get(roomId).isPlaying = true;
        broadcast(room?.connections, roomsList.get(roomId));
        break;
      case 'changeProgress':
        roomsList.get(roomId).progress = data.progress;
        broadcast(room?.connections, roomsList.get(roomId));
        break;
      default:
        connection.socket.send('Event not match in list');
    }
  });
};
