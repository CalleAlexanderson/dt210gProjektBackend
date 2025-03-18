const { ObjectId } = require('@fastify/mongodb');

async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection('books')

  // fångar upp preflights
  fastify.options('*', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    reply.header("Access-Control-Allow-Headers", "Authorization");
    return;
  })

  const BookBodyJsonSchema = {
    type: 'object',
    required: ['title', 'author' ],
    properties: {
      title: { type: 'string' },
      author: { type: 'date-time' },
      description: { type: 'date-time' },
      categories: { type: 'array' },
      pageCount: { type: 'number' },
      averageRating: { type: 'number' },
      ratingsCount: { type: 'number' },
    }
  }

  const BookSchema = {
    body: BookBodyJsonSchema,
  }

  fastify.post('/add/book', BookSchema, async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    // return { message: "add funkar"}
    await request.jwtVerify()
    console.log("lägger till book");


    let { username, title, author, description, categories, pageCount, averageRating, ratingsCount} = request.body;
    let publishedDate = new Date();

    // return { message: "postat review"}
    const result = await collection.insertOne({ username, title, author, description, categories, publishedDate, pageCount, averageRating, ratingsCount })
    return result
  })

  fastify.get('/books', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");

    const result = await collection.find().toArray()
    if (result.length === 0) {
      return { message: "inga böcker hittades" }
    }
    return result
  })

  fastify.get('/book/:id', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    // return { message: "single review funkar"}
    const id = new ObjectId(request.params.id);

    const result = await collection.findOne({ _id: id })
    return result
  })

  fastify.delete('/delete/book/:id', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    return { message: "delete funkar" }

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
      return { message: "Bloginlägg med id '" + request.params.id + "' finns inte" }
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