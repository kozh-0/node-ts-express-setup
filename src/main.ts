import "dotenv/config";
import express from "express";
import cors from "cors";
import { MyLogger } from "./helper/logger";
import { userRouter } from "./user";
import { ErrorHandlerMiddleware } from "./helper/errorHandlerMiddleware";
import { PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

export const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

// Базовые middleware
// Чтобы принимать JSON параметры в res.body в POST PUT запросах
app.use(express.json());
// Чтобы распозновать переданные данные как строку или массив
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:3333", "*"] }));

// middleware к роутам
// app.use((req, res, next) => {
//   MyLogger.log("APP MIDDLEWARE", req.body);
//   next();
// });

app.use("", userRouter);

// После возникновения ошибки в middleware'ах или роутах код попадет сюда, перед тем как отправится к пользователю
// ТОЛЬКО ЕСЛИ КОД СИНХРОННЫЙ ИЛИ КОЛБЕЧНЫЙ, иначе приложение сломается
app.use(ErrorHandlerMiddleware);

app.listen(port, () => {
  if (!process.env.ACCESS_TOKEN_SECRET && !process.env.REFRESH_TOKEN_SECRET)
    throw Error("Не выставлен JWT секрет!");
  MyLogger.log(`[API]: Server is running at http://localhost:${port}`);
  prisma
    .$connect()
    .then(() => MyLogger.log(`[DB]: BD is running`))
    .catch((err: PrismaClientInitializationError) => MyLogger.error(`[DB]: ${err.message}`));
});
