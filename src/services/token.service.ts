import * as jwt from 'jsonwebtoken';

import { configs } from '../configs';
import { EActionTokenType, ETokenType } from '../enums';
import { ApiError } from '../errors';
import { ITokenPayload, ITokensPair } from '../types';

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

  public generateActionToken(
    payload: ITokenPayload,
    tokenType: EActionTokenType
  ): string {
    try {
      let secret: string;
      let expiresIn: string;

      switch (tokenType) {
        case EActionTokenType.Activate:
          secret = configs.JWT_ACTIVATE_SECRET;
          expiresIn = configs.JWT_ACTIVATE_EXPIRES_IN;
          break;
        case EActionTokenType.Forgot:
          secret = configs.JWT_FORGOT_SECRET;
          expiresIn = configs.JWT_FORGOT_EXPIRES_IN;
      }

      return jwt.sign(payload, secret, { expiresIn });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public checkToken(
    token: string,
    tokenType: ETokenType | EActionTokenType
  ): ITokenPayload {
    try {
      let secret: string;

      switch (tokenType) {
        case ETokenType.Access:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case ETokenType.Refresh:
          secret = configs.JWT_REFRESH_SECRET;
          break;
        case EActionTokenType.Activate:
          secret = configs.JWT_ACTIVATE_SECRET;
          break;
        case EActionTokenType.Forgot:
          secret = configs.JWT_FORGOT_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
