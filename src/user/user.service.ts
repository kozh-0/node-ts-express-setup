import { prisma } from '../main';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { MyError } from '../helper/errorHandler';

// Типа база, слетает при перезапуске проекта, надо сделать в редисе и чтобы само удалялось через время
const arr: string[] = [];

// Refresh токен хранить в редисе, он бесконечный, не истекает, удаеляем вручную при логауте
const issueJWTs = (payload: any) => {
  // тут будет JWT секрет, иначе без него не запустится сервер
  const refreshToken = jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET!);
  const accessToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET!, {
    algorithm: 'HS256',
    expiresIn: '10m',
  });

  return { accessToken, refreshToken };
};

export abstract class UserService {
  // getUsers (возвращает хэш паролей)
  static async getUsers() {
    return await prisma.user.findMany();
  }

  // register
  static async createUser(
    username: string,
    // Добавить валидацию емейла и пароля
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!password || !username || !email) throw new MyError('Some credentials are missing', 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;
    const tokens = issueJWTs(userWithoutPassword);
    if (!arr.includes(tokens.refreshToken)) arr.push(tokens.refreshToken);
    return tokens;
  }

  // login
  static async checkUser(
    username: string,
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!password && (!username || !email)) throw new MyError('Some credentials are missing', 400);

    // Вход по юзернейму либо паролю
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...userWithoutPassword } = user;
      const tokens = issueJWTs(userWithoutPassword);
      if (!arr.includes(tokens.refreshToken)) arr.push(tokens.refreshToken);
      return tokens;
    }
    throw new MyError('No such user', 400);
  }

  static async updateToken(refreshToken: undefined | string) {
    console.log(arr);

    if (!refreshToken) throw new MyError('Incorrect cookie', 400);
    if (!arr.includes(refreshToken)) throw new MyError('No such token', 403);

    const user: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const { password: _, ...userWithoutPassword } = user;

    const { accessToken } = issueJWTs(userWithoutPassword);
    return { accessToken };
  }
}
