const fastify = require("fastify")({ logger: true });
const path = require("node:path");
const mongoose = require("mongoose");
require("dotenv").config();
fastify.decorate("authenticated", async (req, reply) => {
  try {
    await req.jwt.verify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.register(require("@fastify/jwt"), {
  secret: "Petya pendos",
});

fastify.register(require("@fastify/autoload"), {
  dir: path.join(__dirname, "routes"),
});

const start = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await fastify.listen({
    port: process.env.PORT || 4000,
    host: process.env.HOST,
  });
};

start();
