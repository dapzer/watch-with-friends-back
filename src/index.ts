import fastify from 'fastify'

const port = 8080

const server = fastify()

server.get('/s', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
