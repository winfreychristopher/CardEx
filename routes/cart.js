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
    console.log(cart);
    res.send({
      message: "Cart retrived Successfully!",
      data: cart
    });
    console.log(cart);
    return cart;
  } catch (err) {
    throw err;
  }
})

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
  let { quantity } = req.body;
  if (!quantity) { quantity = 1 }
  console.log(quantity)
  try {
    const cart = await addCardToCart(userId, cardId);
    res.send({
      message: "Successfully added Item to Cart",
      cartContent: cart,
    });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/:itemId", requireUser, async (req, res, next) => {
  const { itemId } = req.params;
  const { id } = req.user;

  try {
    const deletedCard = await deleteCardFromCart(id, itemId);
    console.log(deletedCard, "Ayy Yoo")
    res.send({
      data: deletedCard, 
      message: "I AM"});
  } catch (error) {
    next(error, "Witness me");
  }
});

module.exports = cartRouter;