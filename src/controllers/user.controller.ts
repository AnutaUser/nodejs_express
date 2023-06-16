import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';
import { userService } from '../services';
import { IUser } from '../types';

class UserController {
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAll();
      return res.status(200).json(users);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async getByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const userById = await userService.getByUserId(userId);

      return res.status(200).json(userById);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const updateUser = await userService.update(userId, req.body);

      return res.status(200).json(updateUser);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async deleteByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;

      await userService.deleteByUserId(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const userController = new UserController();
