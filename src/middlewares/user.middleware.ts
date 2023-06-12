import { NextFunction, Request, Response } from 'express';
import { isObjectIdOrHexString } from 'mongoose';

import { ApiError } from '../errors';
import { UserValidator } from '../validators';

class UserMiddleware {
  public async isCreateValid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { error, value } = UserValidator.create.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 400);
      }

      req.res.locals = value;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isUpdateValid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { error, value } = UserValidator.update.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 400);
      }

      req.res.locals = value;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isUserIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!isObjectIdOrHexString(userId)) {
        return new ApiError('ID is not valid', 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
