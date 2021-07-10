const express = require("express");
const cartRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const { getCartByUserId, getCardsById, addCardToCart, deleteCardFromCart } = require("../db");

cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");

  next();
});

cartRouter.get("/:userId", requireUser, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const cart = await getCartByUserId(userId);
    res.send(cart);
  } catch (error) {
    throw error;
  }
});

cartRouter.delete("/:cardId", requireUser, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { cardId } = req.params;
    const removedCard = await deleteCardFromCart(id, cardId)
    res.send(removedCard)
  } catch (error) {
    throw error
  }
})

module.exports = cartRouter;
