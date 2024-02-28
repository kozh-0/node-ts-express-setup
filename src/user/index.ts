import express, { Request } from "express";
import { addUser, checkUser, getUsers } from "./user.service";

export const userRouter = express.Router();

// middleware именно для роутера /user
// userRouter.use((req, res, next) => {
//   MyLogger.warn("On User route");
//   next();
// });

userRouter.get("/users", (_, res) => {
  const users = getUsers();
  res.send(users);
});

userRouter.post("/login", (req: Request<{}, {}, { password: string; username: string }>, res) => {
  const { password, username } = req.body;
  const user = checkUser(password, username);

  res.status(200).json(user);
});

userRouter.post(
  "/register",
  (req: Request<{}, {}, { password: string; username: string }>, res) => {
    const { password, username } = req.body;
    const user = addUser(password, username);

    res.status(201).json(user);
  }
);
