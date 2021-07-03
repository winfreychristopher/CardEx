const express = require("express");
const cardsRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const {
  getAllCards,
  createCard,
  updateViewCount,
  patchCards,
  getCardsById,
} = require("../db");

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

cardsRouter.post("/", requireUser, async (req, res, next) => {
  const { card_title, description, price, card_img, view_count } = req.body;
  const cardData = {};

  try {
    cardData.card_title = card_title;
    cardData.description = description;
    cardData.price = price;
    cardData.card_img = card_img;
    cardData.view_count = view_count;

    const card = await createCard(cardData);
    res.send(card);
  } catch (error) {
    throw error;
  }
});

cardsRouter.patch("/:id/views", async (req, res, next) => {
  const { id } = req.params;

  try {
    await updateViewCount(id);
    res.send({ message: "Updated views!" });
  } catch (error) {
    throw error;
  }
});

cardsRouter.patch("/:cardId", requireUser, async (req, res, next) => {
  const { card_title, description, price, card_img } = req.body;
  const { cardId } = req.params;
  const cardData = {};

  if (card_title) {
    cardData.card_title = card_title;
  }
  if (description) {
    cardData.description = description;
  }
  if (price) {
    cardData.price = price;
  }
  if (card_img) {
    cardData.card_img = card_img;
  }

  try {
    const originalCard = await getCardsById(cardId);
    if (originalCard) {
    }
  } catch (error) {}
});

module.exports = cardsRouter;
