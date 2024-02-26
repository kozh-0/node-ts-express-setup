import "dotenv/config";
import express from "express";
import cors from "cors";
import { MyLogger } from "./helper/logger";
import { userRouter } from "./user";
import { ErrorHandlerMiddleware } from "./helper/errorHandlerMiddleware";

const app = express();
const port = process.env.PORT || 3000;

// Базовые middleware
// Чтобы принимать JSON параметры в res.body в POST PUT запросах
app.use(express.json());
// Чтобы распозновать переданные данные как строку или массив
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:3333", "*"] }));

// middleware к роутам
app.use((req, res, next) => {
  MyLogger.log("APP MIDDLEWARE", req.body);
  next();
});

app.use("/user", userRouter);

// После возникновения ошибки в middleware'ах или роутах код попадет сюда, перед тем как отправится к пользователю
app.use(ErrorHandlerMiddleware);

app.listen(port, () => {
  MyLogger.log(`[server]: Server is running at http://localhost:${port}`);
});
