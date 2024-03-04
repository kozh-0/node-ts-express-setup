import { prisma } from "../main";

export abstract class PrismaUserService {
  // users
  public static async getUsers() {
    return await prisma.user.findMany();
  }

  // register
  public static async createUser(password: string, username: string) {
    if (!password || !username) return { user: null, err: "Password or username is missing" };
    try {
      const user = await prisma.user.create({ data: { username, password } });
      return { user, err: "" };
    } catch (error) {
      return { user: null, err: "Such user already exists" };
    }
  }

  // login
  public static async checkUser(password: string, username: string) {
    if (!password || !username) return { user: null, err: "Password or username is missing" };

    const user = await prisma.user.findFirst({
      where: { username: { equals: username }, password: { equals: password } },
    });

    return { user: user?.id ? true : null, err: user ? "" : "No such user" };
  }
}
