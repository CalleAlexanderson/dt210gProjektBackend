const fastifyPlugin = require('fastify-plugin') //importerar plugin

// skapar en anslutning mot databas
async function dbConnector (fastify, options) {
  fastify.register(require('@fastify/mongodb'), {
    url: 'mongodb://localhost:27017/dt210gprojekt'
  })
}

//exporterar anslutningen
module.exports = fastifyPlugin(dbConnector)