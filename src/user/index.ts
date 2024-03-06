import express, { Request } from "express";
import { PrismaUserService } from "./db.user.service";
import { AuthMiddleware } from "../helper/authMiddleware";

export const userRouter = express.Router();

userRouter.use(AuthMiddleware);

userRouter.post("/users", async (_, res) => {
  const users = await PrismaUserService.getUsers();
  res.status(200).json(users);

  // users.err ? res.status(500).json(users) : res.status(200).json(users);
});

userRouter.post("/login", async (req: Request, res) => {
  const { username, email, password } = req.body;
  const user = await PrismaUserService.checkUser(username, email, password);

  // @ts-ignore
  user.err ? res.status(404).json(user) : res.status(200).json(user);
});

userRouter.post("/register", async (req: Request, res) => {
  const { username, email, password } = req.body;
  const user = await PrismaUserService.createUser(username, email, password);

  // @ts-ignore
  user.err ? res.status(400).send(user) : res.status(201).json(user);
});
