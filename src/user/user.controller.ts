import { Request, Response } from 'express';
import { UserService } from './user.service';

export abstract class UserController {
  // getUsers
  static async getUsers(_: Request, res: Response) {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  }

  // register
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const userData = await UserService.createUser(username, email, password);

    res.cookie('refreshToken', userData.refreshToken);
    res.status(201).json(userData);
  }

  // login
  static async login(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const userData = await UserService.checkUser(username, email, password);

    res.cookie('refreshToken', userData.refreshToken /* , {maxAge:} */);
    res.status(200).json(userData);
  }

  // token
  static async newToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    console.log(refreshToken + '\n\n');

    const accessToken = await UserService.updateToken(refreshToken);

    // res.cookie('refreshToken', userData.refreshToken /* , {maxAge:} */);

    res.status(200).json(accessToken);
  }
}
