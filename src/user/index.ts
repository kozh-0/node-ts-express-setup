import express, { Request } from "express";
import { UserService } from "./json.user.service";
import { PrismaUserService } from "./db.user.service";

export const userRouter = express.Router();

// middleware именно для роутера /user
// ТУТ ВАЛИДИРОВАТЬ ДАННЫЕ МОЖНО
// userRouter.use((req, res, next) => {
//   MyLogger.warn("On User route");
//   next();
// });

userRouter.post("/users", async (_, res) => {
  const users = await PrismaUserService.getUsers();
  res.status(200).json(users);

  // users.err ? res.status(500).json(users) : res.status(200).json(users);
});

userRouter.post(
  "/login",
  async (req: Request<{}, {}, { password: string; username: string }>, res) => {
    const { password, username } = req.body;
    const user = await PrismaUserService.checkUser(password, username);

    user.err ? res.status(404).json(user) : res.status(200).json(user);
  }
);

userRouter.post(
  "/register",
  async (req: Request<{}, {}, { password: string; username: string }>, res) => {
    const { password, username } = req.body;
    const user = await PrismaUserService.createUser(password, username);

    user.err ? res.status(400).send(user) : res.status(201).json(user);
  }
);
