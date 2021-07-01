const express = require("express");
const cardsRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const { getAllCards } = require("../db");

cardsRouter.use((req, res, next) => {
  console.log("A request is being made to /cards");

  next();
});

cardsRouter.get("/", async (req, res, next) => {
  try {
    const cards = await getAllCards();
    console.log(cards);
    res.send(cards);
  } catch (error) {
    throw error;
  }
});
module.exports = cardsRouter;
