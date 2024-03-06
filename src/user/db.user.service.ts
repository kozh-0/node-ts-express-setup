import { prisma } from "../main";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Время для Access и Refresh токена
const issueJWT = async (payload: any, expiresIn: "20m" | "1d"): Promise<string> => {
  // тут будет JWT секрет, иначе без него не запустится сервер
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn,
  });
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
  ): Promise<{ accessToken: null | string; err: string }> {
    if (!password || !username || !email)
      return { accessToken: null, err: "Some credentials are missing" };

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return await prisma.user
        .create({
          data: { username, email, password: hashedPassword, role: "user" },
        })
        .then(async (user) => {
          const { password, ...userWithoutPassword } = user;
          return { accessToken: await issueJWT(userWithoutPassword, "20m"), err: "" };
        });
    } catch (error: any) {
      console.log(JSON.stringify(error));

      return { accessToken: null, err: error.name || "Such user already exists" };
    }
  }

  // login
  public static async checkUser(
    username: string,
    email: string,
    password: string
  ): Promise<{ accessToken: null | string; err: string }> {
    if (!password && (!username || !email))
      return { accessToken: null, err: "Some credentials are missing" };

    // Вход по юзернейму либо паролю
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      const accessToken = await issueJWT(userWithoutPassword, "20m");
      return { accessToken, err: "" };
    }

    return { accessToken: null, err: "No such user" };
  }
}
