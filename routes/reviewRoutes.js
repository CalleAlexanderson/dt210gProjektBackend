async function reviewRoutes(fastify, options) {
    const collection = fastify.mongo.db.collection('reviews')

    const reviewBodyJsonSchema = {
        type: 'object',
        required: ['userId', 'bookId', 'score'],
        properties: {
            userId: { type: 'object' },
            bookId: { type: 'object' },
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
        return { message: "add funkar"}
        await request.jwtVerify()


        let { title, author, content } = request.body;
        let date = new Date();
        if (title.length === 0 || author.length === 0 || content.length === 0) {
            return { message: "fälten 'title' 'author' och 'content' får inte lämnas tomma" }
        }

        const result = await collection.insertOne({ title, author, content, date })
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