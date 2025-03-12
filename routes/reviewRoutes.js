async function reviewRoutes(fastify, options) {
    const collection = fastify.mongo.db.collection('reviews')

    const reviewBodyJsonSchema = {
        type: 'object',
        required: ['username', 'bookid', 'score'],
        properties: {
            username: { type: 'string' },
            bookid: { type: 'string' },
            score: { type: 'number'},
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
        // await request.jwtVerify()


        let { username, bookid, score,  content} = request.body;
        let date = new Date();


        if (username === undefined) {
          return { message: "fältet 'username' måste skickas med i body" }
        }

        if (bookid === undefined) {
          return { message: "fältet 'bookid' måste skickas med i body" }
        }

        if (score === undefined) {
          return { message: "fältet 'score' måste skickas med i body" }
        }

        if (username.length === 0 || bookid.length === 0 || score.length === 0) {
            return { message: "fälten 'username', 'bookid' och 'score' får inte lämnas tomma" }
        }

        // return { message: "postat review"}
        const result = await collection.insertOne({ username, bookid, score, date, content })
        return result
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