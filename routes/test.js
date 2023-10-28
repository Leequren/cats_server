// const fastify = require("fastify");

const fastify = require("fastify");
const mongoose = require("mongoose");
const User = require("../models/User");

const testGet = {
  method: "GET",
  url: "/test",
  handler: async (req, reply) => {
    return "test hello world";
  },
};

const signUpPost = {
  method: "POST",
  url: "/signup",
  handler: async (req, reply) => {
    const fastify = req.server;
    const { login, password } = req.body;
    if (!(await User.findOne({ loginUser: login }))) {
      const user = await User.create({
        loginUser: login,
        passwordUser: password,
      });
      const token = fastify.jwt.sign({
        idUser: user._id,
      });

      return reply.send({ registered: true, token: token });
    } else {
      return reply.code(403).send({ error: "user already registered" });
    }
  },
};

const validateToken = {
  method: "GET",
  url: "/validateToken",
  handler: async (req, reply) => {
    console.log(req.headers);
    try {
      await req.jwtVerify();
      return req.user;
    } catch (err) {
      reply.code(403).send({ message: "token is INVALID" });
    }
  },
};

module.exports = async function (fastify, options) {
  fastify.route(testGet);
  fastify.route(signUpPost);
  fastify.route(validateToken);
};
