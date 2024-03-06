import { prisma } from "../main";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Refresh токен хранить в редисе
const issueJWTs = (payload: any) => {
  // тут будет JWT секрет, иначе без него не запустится сервер
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!);
  const accessToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "20m",
  });

  return { accessToken, refreshToken };
};

// Разбить на отдельные файлы, чтобы можно было их легко заменить по лейер архитектуре

// Надо сделать нормальный throw Error, чтобы правильно распределять ошибки
export abstract class PrismaUserService {
  // users
  public static async getUsers() {
    return await prisma.user.findMany();
  }

  // register
  public static async createUser(
    username: string,
    // Добавить валидацию емейла и пароля
    email: string,
    password: string
  ): Promise<{ err: string } | { accessToken: string; refreshToken: string }> {
    if (!password || !username || !email) return { err: "Some credentials are missing" };

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return await prisma.user
        .create({
          data: { username, email, password: hashedPassword, role: "user" },
        })
        .then((user) => {
          const { password, ...userWithoutPassword } = user;
          return issueJWTs(userWithoutPassword);
        });
    } catch (error: any) {
      console.log(JSON.stringify(error));

      return { err: error.name || "Such user already exists" };
    }
  }

  // login
  public static async checkUser(
    username: string,
    email: string,
    password: string
  ): Promise<{ err: string } | { accessToken: string; refreshToken: string }> {
    if (!password && (!username || !email)) return { err: "Some credentials are missing" };

    // Вход по юзернейму либо паролю
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return issueJWTs(userWithoutPassword);
    }

    return { err: "No such user" };
  }
}
