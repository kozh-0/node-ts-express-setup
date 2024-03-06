import { prisma } from "../main";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Проверить валидность минут и дней
const issueJWT = async (username: string, expiresIn: "20m" | "1d") => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw Error("No JWT secret is set in Env file");

  return jwt.sign({ user: username }, secret, { algorithm: "HS256", expiresIn });
};

export abstract class PrismaUserService {
  // Надо сделать нормальный throw Error, чтобы правильно распределять ошибки

  // users
  public static async getUsers() {
    return await prisma.user.findMany();
  }

  // добавление соли к хешированию пароля, чтобы даже если пароли у пользователей были одинаковы, то соль в начале будет делать их разными, соль всегда меняется
  // так пароли не взломают
  // register
  public static async createUser(
    username: string,
    // Добавить валидацию емейла и пароля
    email: string,
    password: string
  ): Promise<{ token: null | string; err: string }> {
    if (!password || !username || !email)
      return { token: null, err: "Some credentials are missing" };

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return await prisma.user
        .create({
          data: { username, email, password: hashedPassword, role: "user" },
        })
        .then(async () => ({ token: await issueJWT(username, "20m"), err: "" }));
    } catch (error: any) {
      console.log(JSON.stringify(error));

      return { token: null, err: error.name || "Such user already exists" };
    }
  }

  // login
  public static async checkUser(
    username: string,
    email: string,
    password: string
  ): Promise<{ token: null | string; err: string }> {
    if (!password && (!username || !email))
      return { token: null, err: "Some credentials are missing" };

    // Вход по юзернейму либо паролю
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await issueJWT(username, "20m");
      return { token, err: "" };
    }

    return { token: null, err: "No such user" };
  }
}
