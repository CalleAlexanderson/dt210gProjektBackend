const { ObjectId } = require("@fastify/mongodb");

async function reviewRoutes(fastify, options) {
  const collection = fastify.mongo.db.collection('reviews')

  const reviewBodyJsonSchema = {
    type: 'object',
    required: ['username', 'bookid', 'rating'],
    properties: {
      username: { type: 'string' },
      title: { type: 'string' },
      bookid: { type: 'string' },
      rating: { type: 'number' },
      date: { type: 'date-time' },
      content: { type: 'string' },

    }
  }

  const reviewSchema = {
    body: reviewBodyJsonSchema,
  }

  fastify.post('/add/review', reviewSchema, async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    // return { message: "add funkar"}
    await request.jwtVerify()
    console.log("lägger till review");


    let { username, title, bookid, rating, content } = request.body;
    let date = new Date();


    const res = await collection.find({ username: username, bookid: bookid }).toArray();
    if (res[0] != undefined) {
      return { message: "Review finns redan för denna bok" }
    }


    if (username === undefined) {
      return { message: "fältet 'username' måste skickas med i body" }
    }

    if (bookid === undefined) {
      return { message: "fältet 'bookid' måste skickas med i body" }
    }

    if (rating === undefined) {
      return { message: "fältet 'rating' måste skickas med i body" }
    }

    if (username.length === 0 || bookid.length === 0) {
      return { message: "fälten 'username', 'bookid' får inte lämnas tomma" }
    }

    // return { message: "postat review"}
    const result = await collection.insertOne({ username, title, bookid, rating, date, content })
    return result
  })

  fastify.get('/reviews/:id', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    // return { message: "reviews funkar"}
    const id = request.params.id;

    const result = await collection.find({bookid: id}).toArray()
    return result
  })

  fastify.get('/review/:id/:user', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    // return { message: "single review funkar"}
    const id = request.params.id
    const username = request.params.user
    
    const result = await collection.findOne({  username: username, bookid: id })
    console.log(result);
    return result
  })

  fastify.delete('/delete/review/:id', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    // return { message: "delete funkar" }

    await request.jwtVerify()
    const id = new ObjectId(request.params.id);

    const result = await collection.deleteOne({ _id: id })
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
module.exports = reviewRoutes;