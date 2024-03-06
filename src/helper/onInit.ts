import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { prisma } from "../main";
import { MyLogger } from "./logger";

export const ON_INIT = () => {
  if (!process.env.PORT) throw Error("Не выставлен порт!");
  if (!process.env.ACCESS_TOKEN_SECRET && !process.env.REFRESH_TOKEN_SECRET)
    throw Error("Не выставлен JWT секрет!");

  MyLogger.log(`[API]: Server is running at http://localhost:${process.env.PORT}`);

  prisma
    .$connect()
    .then(() => MyLogger.log(`[DB]: BD is running`))
    .catch((err: PrismaClientInitializationError) => MyLogger.error(`[DB]: ${err.message}`));
};
