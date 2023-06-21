import * as jwt from 'jsonwebtoken';

import { configs } from '../configs';
import { ETokenType } from '../enums';
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

  public checkToken(token: string, tokenType: ETokenType): ITokenPayload {
    try {
      let secret: string;

      switch (tokenType) {
        case ETokenType.Access:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case ETokenType.Refresh:
          secret = configs.JWT_REFRESH_SECRET;
          break;
        case ETokenType.Activate:
          secret = configs.JWT_ACTIVATE_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
