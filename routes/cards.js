const express = require("express");
const cardsRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser, requireAdmin } = require("./utils");
const {
  getAllCards,
  createCard,
  updateViewCount,
  patchCards,
  getCardsById,
  getCardUserById,
  deleteCard,
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

cardsRouter.get("/:cardId", async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const card = await getCardsById(cardId);
    if (!card) {
      next();
    } else {
      console.log(card);
      res.send(card);
    }
  } catch (error) {
    next(error);
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
    const updatedCard = await patchCards(cardId, cardData);
    console.log(updatedCard);
    res.send(updatedCard);
  } catch (error) {
    next(error);
  }
});

cardsRouter.delete("/:cardId", async (req, res, next) => {
  const { cardId } = req.params;
  try {
    // const card = await getCardsById(cardId);
    const deletedCard = await deleteCard(cardId);
    console.log(deletedCard);
    res.send(deletedCard);
  } catch (error) {
    next(error);
  }
});

module.exports = cardsRouter;
