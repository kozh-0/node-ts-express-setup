import { Router } from 'express';
import { AuthMiddleware } from '../helper/authMiddleware';
import { UserController } from './user.controller';
import { tryCatchWrapper } from '../helper/errorHandler';

export const userRouter = Router();

userRouter.use(AuthMiddleware);

// TryCatch обертку сделать, чтобы throw Error делать
userRouter.post('/getUsers', tryCatchWrapper(UserController.getUsers));
userRouter.post('/register', tryCatchWrapper(UserController.register));
userRouter.post('/login', tryCatchWrapper(UserController.login));
