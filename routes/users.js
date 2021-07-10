const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser, requireAdmin } = require("./utils");
const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
} = require("../db");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    console.log(users);
    res.send(users);
  } catch (error) {
    throw error;
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);
    if (!user) {
      next(error);
    } else {
      console.log(user);
      res.send(user);
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.status(401);
      next({
        name: "UserAlreadyExists",
        message: "A user by that username already exists",
      });
    } else if (password.length < 5) {
      res.status(401);
      next({
        name: "InputError",
        message: "Password must be atleast 5 characters",
      });
    } else {
      const newUser = await createUser({
        username,
        password,
      });
      if (!newUser) {
        next({
          name: "usercreationerror",
          message: "Problem with registration",
        });
      } else {
        const token = jwt.sign(
          { id: newUser.id, username: newUser.username },
          JWT_SECRET,
          { expiresIn: "1w" }
        );
        res.send({
          message: "Thank you for signing up!",
          token,
          user: newUser,
        });
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUser({ username, password });
    console.log(user)
    if (!user) { 
      res.send({ message: "Error: There is no CardEx Account associated with this User." })
    } else {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1w" }
      );
      res.send({ message: "You're Logged In!", token, user: user });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;