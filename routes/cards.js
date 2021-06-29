const express = require("express");
const cardsRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

cardsRouter.use((req, res, next) => {
  console.log("A request is being made to /cards");

  next();
});

module.exports = cardsRouter;
