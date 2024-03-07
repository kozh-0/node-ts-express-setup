import { Request, Response } from 'express';
import { UserService } from './user.service';
// Разбить на отдельные файлы, чтобы можно было их легко заменить по лейер архитектуре

// Надо сделать нормальный throw Error, чтобы правильно распределять ошибки
export abstract class UserController {
  // getUsers
  public static async getUsers(_: Request, res: Response) {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  }

  // register
  public static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const userData = await UserService.createUser(username, email, password);

    res.cookie('refreshToken', userData.refreshToken);
    res.status(201).json(userData.accessToken);
  }

  // login
  public static async login(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const userData = await UserService.checkUser(username, email, password);

    res.cookie('refreshToken', userData.refreshToken /* , {maxAge:} */);
    res.status(200).json(userData.accessToken);
  }
}
