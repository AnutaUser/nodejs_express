import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';
import { User } from '../models';
import { IUser } from '../types';

class UserMiddleware {
  public findAndThrow(field: keyof IUser) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await User.findOne({ [field]: req.body[field] });

        if (user) {
          throw new ApiError('User with this email already exist', 409);
        }
        next();
      } catch (e) {
        throw new ApiError('User not found', 422);
      }
    };
  }

  public isUserExist<T>(field: keyof T) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = await User.findOne({ [field]: req.body[field] });

        if (!user) {
          throw new ApiError('User not found', 422);
        }

        req.res.locals.user = user;
        next();
      } catch (e) {
        next(new ApiError(e.message, e.status));
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
