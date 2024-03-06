import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/login" || req.path === "/register") return next();

  if (req.headers.authorization) {
    // На случай формата Bearer JWT
    const jwt =
      req.headers.authorization.split(" ")[req.headers.authorization.split(" ").length - 1];

    // тут надо будет сделать проверку и перевыпуск ацес токена, при наличии рефреш, который будет лежать в редисе
    verify(jwt, process.env.ACCESS_TOKEN_SECRET as string);
    return next();
  }

  res.status(401).send({ err: "No Authorization header provided" });
};
