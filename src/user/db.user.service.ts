import { prisma } from "../main";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export abstract class PrismaUserService {
  // users
  public static async getUsers() {
    return await prisma.user.findMany();
  }

  // добавление соли к хешированию пароля, чтобы даже если пароли у пользователей были одинаковы, то соль в начале будет делать их разными, соль всегда меняется
  // так пароли не взломают
  // register
  public static async createUser(password: string, username: string) {
    if (!password || !username) return { user: null, err: "Password or username is missing" };
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({ data: { username, password: hashedPassword } });
      return { user: "ТУТ БУДЕТ JWT", err: "" };
    } catch (error) {
      return { user: null, err: "Such user already exists" };
    }
  }

  // login
  public static async checkUser(password: string, username: string) {
    if (!password || !username) return { user: null, err: "Password or username is missing" };

    const user = await prisma.user.findFirst({
      where: { username: { equals: username } },
    });

    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      return { users: isCorrectPassword, err: "" };
    }

    return { user, err: "No such user" };
  }

  // Надо сделать нормальный throw Error, чтобы правильно распределять ошибки
  static async issueJWT() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw Error("No JWT secret is set in Env file");

    const token = jwt.sign({ foo: "bar" }, secret, { algorithm: "HS256" });

    return { token };
  }
}
