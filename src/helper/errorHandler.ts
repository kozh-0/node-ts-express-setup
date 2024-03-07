import { NextFunction, Request, Response } from 'express';
import { MyLogger } from './logger';

export class MyError extends Error {
  statusCode: number;
  context?: string;
  constructor(message: string, statusCode: number, context?: string) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.context = context;
  }
}

export const ErrorHandlerMiddleware = (err: Error | MyError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MyError) {
    MyLogger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode).send({ err: err.message });
  } else {
    MyLogger.error(err.message);
    res.status(500).send({ err: err.message });
  }
};

export const tryCatchWrapper = (controllerFunc: any) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await controllerFunc(req, res);
    } catch (err) {
      next(err);
    }
  };
};
