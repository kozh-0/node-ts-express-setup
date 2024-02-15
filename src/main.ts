import "dotenv/config";
import express from "express";
import cors from "cors";
import { MyLogger } from "./helper/logger";
import { userRouter } from "./user";

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

app.get("/", (req, res) => {
  res.send("HELLO! Express + TypeScript Server");
});

app.listen(port, () => {
  MyLogger.log(`[server]: Server is running at http://localhost:${port}`);
});
