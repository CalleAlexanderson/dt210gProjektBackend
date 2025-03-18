const { ObjectId } = require('@fastify/mongodb');

async function loginRoutes(fastify, options) {
  const bcrypt = require('bcryptjs');
  const users = fastify.mongo.db.collection('users')

  fastify.post('/login', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    const { username, password } = request.body;
    if (!username || !password) {
      return { message: "användarnamn/lösenord saknas" }
    }

    //hämtar user
    const user = await users.find({ username: username }).toArray();

    if (user[0] != undefined) { //om user finns kollas lösenord

      if (await bcrypt.compare(password, user[0].password)) {
        const token = fastify.jwt.sign({ payload: "data" }, { expiresIn: '1h' })
        return { token: token, user: user[0], loggedIn: true }

      } else {
        return { message: "användarnamn och lösenord matchar ej", loggedIn: false }
      }
    } else {
      return { message: "användarnamn och lösenord matchar ej", loggedIn: false }
    }

  })


  const userBodyJsonSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  }

  const userSchema = {
    body: userBodyJsonSchema,
  }


  fastify.post('/account', userSchema, async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");

    let { username, password } = request.body;
    console.log(username);
    console.log(password);

    if (username === undefined) {
      return { message: "fältet 'username' måste skickas med i body" }
    }

    const user = await users.find({ username: username }).toArray();
    if (user[0] != undefined) {
      return { message: "Användarnamn redan taget" }
    }

    if (username.length === 0) {
      return { message: "Användarnman får inte lämnas blankt" }
    }

    if (username.length <= 3) {
      return { message: "Användarnman måste vara längre än 3 tecken" }
    }

    if (password === undefined) {
      return { message: "fältet 'password' måste skickas med i body" }
    }

    if (password.length === 0) {
      return { message: "Lösenord får inte lämnas blankt" }
    }

    if (password.length <= 5) {
      return { message: "Lösenord måste vara längre än 5 tecken" }
    }

    password = await bcrypt.hash(password, 16)

    console.log("encryot: " + password);

    const result = await users.insertOne({ username, password })
    console.log(result);
    return { accountCreated: true }
  })

  fastify.post('/verify', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    await request.jwtVerify()
    const { id } = request.body;
    const _id = new ObjectId(id);
    const user = await users.findOne({ _id: _id });
    return user
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
module.exports = loginRoutes;