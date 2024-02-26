import express, { Request } from "express";
import { MyLogger } from "../helper/logger";

export const userRouter = express.Router();

// middleware именно для роутера /user
userRouter.use((req, res, next) => {
  MyLogger.warn("On User route");
  next();
});

userRouter.get("/login", (req, res) => {
  throw Error("ВЫЗОВ ОШИБКИ! Для проверки работы ErrorHandlerMiddleware");
  res.send("login");
});

userRouter.post("/register", (req: Request<{ kek: string }>, res) => {
  res.status(228).json(req.body);
});
