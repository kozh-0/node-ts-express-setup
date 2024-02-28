import { NextFunction, Request, Response } from "express";
import { MyLogger } from "./logger";

export const ErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  MyLogger.error(`Возникла ошибка: ${err}`);
  res.status(500).send({ err: err.message });
};

// export const tryCatch = async <T = any>(
//   controller: (req: Request<{}, {}, T>, res: Response, next?: NextFunction) => Promise<void>
// ) => {
//   try {
//     //@ts-ignore
//     await controller(req, res);
//   } catch (error) {
//     //@ts-ignore
//     return next(error);
//   }
// };
