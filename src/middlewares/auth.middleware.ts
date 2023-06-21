import { NextFunction, Request, Response } from 'express';

import { ETokenType } from '../enums';
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

      const payload = tokenService.checkToken(accessToken, ETokenType.Access);

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

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.get('Authorization');

      if (!refreshToken) {
        throw new ApiError('No token', 401);
      }

      const payload = tokenService.checkToken(refreshToken, ETokenType.Refresh);

      const entity = await Token.findOne({ refreshToken });

      if (!entity) {
        throw new ApiError('Not valid token', 401);
      }

      req.res.locals.oldTokensPair = entity;
      req.res.locals.tokenPayload = payload;
      next();
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const authMiddleware = new AuthMiddleware();
