const express = require("express");
const ordersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser, requireAdmin } = require("./utils");
const { createUserOrder, getAllOrders } = require("../db");

ordersRouter.get("/", requireUser, async (req, res, next) => {
  try {
    const data = await createUserOrder(req.user.id);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});

ordersRouter.get("/all", async (req, res, next) => {
  try {
    const data = await getAllOrders();
    const orders = [];
    data.forEach((el, index) => {
      if (orders.some((order) => order.id === el.id)) {
        const orderIndx = orders.findIndex((e) => e.id === el.id);
        orders[orderIndx].products.push(el);
      } else {
        orders.push({
          id: el.id,
          products: [
            {
              card_title: el.card_title,
              price: el.price,
              card_img: el.card_img,
              quanity: el.quanity,
            },
          ],
        });
      }
    });
    res.send(orders);
  } catch (error) {
    console.log(error);
  }
});

module.exports = ordersRouter;
