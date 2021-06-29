const express = require("express");
const cartRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");

  next();
});

module.exports = cartRouter;
