const express = require("express");
const cartRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const {
  getCartByUserId,
  getCardsById,
  addCardToCart,
  createCart,
  getUserById,
  createCartItem,
  deleteCardFromCart,
} = require("../db");
const cardsRouter = require("./cards");

cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");

  next();
});

cartRouter.post("/:userId/:cardId", requireUser, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const addedCart = await createCart(userId);
    console.log(addedCart);
    res.send(addedCart);
  } catch (error) {
    next(error);
  }
});

cartRouter.get("/:userId/:cardId", requireUser, async (req, res, next) => {
  const { userId, cardId } = req.params;
  try {
    const cart = await addCardToCart(userId, cardId);
    console.log(cart);
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/:cardId", requireUser, async (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user;

  try {
    const deletedCard = await deleteCardFromCart(id, cardId);
    return deletedCard;
  } catch (error) {
    throw error;
  }
});
module.exports = cartRouter;
