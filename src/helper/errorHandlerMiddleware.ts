import { NextFunction, Request, Response } from "express";
import { MyLogger } from "./logger";

export const ErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  MyLogger.error(`Возникла ошибка: ${err}`);
  res.status(500).send(err.message);
};
