import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { userRouter } from './user';
import { ErrorHandlerMiddleware } from './helper/errorHandler';
import { PrismaClient } from '@prisma/client';
import { ON_INIT } from './helper/onInit';

export const prisma = new PrismaClient();

const app = express();

// Базовые middleware
// Чтобы принимать JSON параметры в res.body в POST PUT запросах
app.use(express.json());
// Чтобы распозновать переданные данные как строку или массив
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:3333', '*'] }));

app.use('', userRouter);

// После возникновения ошибки в middleware'ах или роутах код попадет сюда, перед тем как отправится к пользователю
// ТОЛЬКО ЕСЛИ КОД СИНХРОННЫЙ ИЛИ КОЛБЕЧНЫЙ, иначе приложение сломается
app.use(ErrorHandlerMiddleware);

app.listen(process.env.PORT, ON_INIT);
