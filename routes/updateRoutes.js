const { ObjectId } = require('@fastify/mongodb');

async function updateRoutes(fastify, options) {
  const collection = fastify.mongo.db.collection('reviews')

  fastify.put('/update/:id', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    await request.jwtVerify()

    let { title, content, rating } = request.body;
    let date = new Date();
    const id = new ObjectId(request.params.id);

    if (title === undefined || content === undefined) {
      return { message: "fälten 'title' och 'content' krävs i body" }
    }

    if (title.length === 0) {
      return { message: "fältet 'title' får inte lämnas tomt" }
    } 
    else if (content.length === 0) {
      return { message: "fältet 'content' får inte lämnas tomt" }
    }

    const result = await collection.updateOne({ _id: id }, { $set: { title: title, content: content, date: date, rating: rating } })

    if (result.matchedCount == 0) {
      return { message: " Blogginlägg med id '" + request.params.id + "' kunde inte uppdateras då det inte hittades", uppdated: false }
    }
    return { uppdated: true }
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
module.exports = updateRoutes