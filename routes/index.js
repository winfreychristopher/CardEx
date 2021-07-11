const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is undercontruction!",
  });
});

apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "All is well" });
  } catch (error) {
    console.error(error);
  }
  next();
});

apiRouter.use(async (req, res, next) => {

  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    if (token !== null) {
      console.log(token)
      try {
        const test = jwt.verify(token, JWT_SECRET);
        if (test.id) {
          req.user = await getUserById(test.id);
          next();
        }
      } catch ({ name, message }) {
        console.log(message, "YA SEE")
        next({ name, message });
      }
    } else {

      next({
        name: "TokenError",
        message: `Authorization starts with ${prefix} but followed by empty string.`,
      });

    }
      
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

const usersRouter = require("./users");
const cardsRouter = require("./cards");
const cartRouter = require("./cart");
const ordersRouter = require("./order");

apiRouter.use("/users", usersRouter);
apiRouter.use("/cards", cardsRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);

module.exports = apiRouter;
