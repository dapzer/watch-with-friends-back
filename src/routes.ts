import { FastifyInstance } from 'fastify';

export const websocketsRoutes = async (server: FastifyInstance) => {
  server.get('/', (request, reply) => ({ msg: 'e' }));
};
