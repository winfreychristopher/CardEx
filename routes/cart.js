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
  getUserCartProducts,
  getCardUserById,
  deleteCardFromCart,
} = require("../db");
const cardsRouter = require("./cards");

cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");

  next();
});

cartRouter.get("/:userId", requireUser, async (req, res, next) => {
  const { userId } = req.params;
  try {
    // Old function that only returned the List of Card ID's Not card objects
    // const cart = await getUserCartProducts(cartId);
    const cart = await getCardUserById(userId);
    console.log(cart, "ME I SEE");
    res.send({
      message: "Cart retrived Successfully!",
      data: cart,
    });
    return cart;
  } catch (error) {
    next(error);
  }
});

cartRouter.post("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const addedCart = await createCart(userId);
    console.log(addedCart);
    res.send(addedCart);
  } catch (error) {
    next(error);
  }
});

cartRouter.post("/:userId/:cardId", async (req, res, next) => {
  const { userId, cardId } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await addCardToCart(userId, cardId, quantity);
    // console.log(cart.cart, "YELLOW");
    // const [test] = cart;
    res.send({
      message: "Successfully added Card",
      cartContent: cart,
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/:cardId", requireUser, async (req, res, next) => {
  console.log("TESTING DELETE ROUTE ON CART!!!!");
  const { cardId } = req.params;
  const { id } = req.user;

  try {
    console.log(id, cardId, "THIS IS ID ON DELETE CARD");
    const deletedCard = await deleteCardFromCart(id, cardId);
    res.send({ deletedCard });
  } catch (error) {
    next(error);
  }
});
module.exports = cartRouter;
