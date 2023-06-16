import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors';
import { Token } from '../models';
import { tokenService } from '../services';

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const accessToken = req.get('Authorization');

      if (!accessToken) {
        throw new ApiError('No token', 401);
      }

      const payload = tokenService.checkToken(accessToken);

      const entity = await Token.findOne({ accessToken });

      if (!entity) {
        throw new ApiError('Token not valid', 401);
      }

      req.res.locals.tokenInfo = payload;
      next();
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const authMiddleware = new AuthMiddleware();
