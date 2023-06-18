import * as jwt from 'jsonwebtoken';

import { configs } from '../configs';
import { ApiError } from '../errors';
import { IActivateToken, ITokenPayload, ITokensPair } from '../types';

class TokenService {
  public generateTokensPare(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: configs.JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: configs.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public generateActivateToken(payload: ITokenPayload): IActivateToken {
    const activateToken = jwt.sign(payload, configs.JWT_ACTIVATE_SECRET);
    return { activateToken };
  }

  public checkToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, configs.JWT_ACCESS_SECRET) as ITokenPayload;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
