const { ObjectId } = require('@fastify/mongodb');

async function routes(fastify, options) {

  // fångar upp preflights
  fastify.options('*', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    reply.header("Access-Control-Allow-Headers", "Authorization");
    return;
  })

  // körs innan schema validering
  fastify.addHook('preValidation', convertBody);

  // middelware för att konvertera body i formatet string till ett object
  function convertBody(request, reply, next) {
    if (typeof request.body === "string") {
      request.body = JSON.parse(request.body);
    }
    next();
  }

}

// eporterar routes
module.exports = routes