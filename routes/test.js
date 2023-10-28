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
        loginUser: user.loginUser,
      });

      return reply.send({ registered: true, token: token , login: user.loginUser});
    } else {
      return reply.code(203).send({ error: "user already registered" });
    }
  },
};
const loginPost = {
  method: "POST",
  url: "/login",
  handler: async (req, reply) => {
    const fastify = req.server
    const {login, password} = req.body
    
    const user = await User.findOne({loginUser: login})
    console.log(req.body, user)
    if(user.passwordUser === password){
      const token = fastify.jwt.sign({
        loginUser: user.loginUser,
      });
      return reply.code(200).send({token: token, login: user.loginUser})
    }
    return reply.code(203).send({message: "wrong data"})
  }
}
const validateToken = {
  method: "GET",
  url: "/validateToken",
  handler: async (req, reply) => {
    console.log(req.headers);
    try {
      await req.jwtVerify();
      reply.code(200).send({mesasage: "token is VALID"})
    } catch (err) {
      reply.code(203).send({ message: "token is INVALID" });
    }
  },
};

module.exports = async function (fastify, options) {
  fastify.route(testGet);
  fastify.route(signUpPost);
  fastify.route(validateToken);
  fastify.route(loginPost)
};
