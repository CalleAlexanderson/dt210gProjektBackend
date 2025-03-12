const { ObjectId } = require('@fastify/mongodb');

async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection('reviews')

  // fångar upp preflights
  fastify.options('*', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    reply.header("Access-Control-Allow-Headers", "Authorization");
    return;
  })

  fastify.get('/reviews', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    return { message: "reviews funkar"}

    const result = await collection.find().toArray()
    if (result.length === 0) {
      return { message: "inga bloginlägg hittades" }
    }
    return result
  })

  fastify.get('/review/:id', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    return { message: "single review funkar"}
    const id = new ObjectId(request.params.id);
    const result = await collection.findOne({ _id: id })
    console.log(new Date());
    if (result === null) {
      return { message: "Blogginlägg med id " + id + " hittades inte" }
    }
    return result
  })

  fastify.delete('/delete/review/:id', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    return { message: "delete funkar"}

    await request.jwtVerify()
    const role = request.body.role;
    const id = new ObjectId(request.params.id);

    if (role === undefined) {
      return { message: "fälte 'role' krävs i body" }
    }

    if (role != "admin") {
      return { message: "Du har inte tillgång till denna funktion", deleted: false }
    }
    const result = await collection.deleteOne({ _id: id })
    if (result.deletedCount == 0) {
      return { message: "Bloginlägg med id '" + request.params.id + "' finns inte"}
    }
    return { deleted: true }
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