import { Types } from 'mongoose';

import { EActionTokenType, EEmailActions } from '../enums';
import { ApiError } from '../errors';
import { Action, OldPassword, Token, User } from '../models';
import { ICredentials, ITokenPayload, ITokensPair, IUser } from '../types';
import { emailService } from './email.service';
import { passwordService } from './password.service';
import { tokenService } from './token.service';

class AuthService {
  public async register(body: IUser): Promise<void> {
    try {
      const hashPass = await passwordService.hash(body.password);

      await Promise.all([
        User.create({ ...body, password: hashPass }),
        emailService.sendMail(body.email, EEmailActions.REGISTER, {
          username: body.username,
          url: 'http://localhost:5555/auth/activate',
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    user: IUser
  ): Promise<ITokensPair> {
    try {
      const isMatched = await passwordService.compare(
        credentials.password,
        user.password
      );

      if (!isMatched) {
        throw new ApiError('wrong email or password', 401);
      }

      const tokensPair = await tokenService.generateTokensPare({
        _id: user._id,
        username: user.username,
      });

      await Token.create({ ...tokensPair, _user: user._id });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    oldTokensPare: ITokensPair,
    tokenPayload: ITokenPayload
  ): Promise<ITokensPair> {
    try {
      const tokensPair = await tokenService.generateTokensPare({
        _id: tokenPayload._id,
        username: tokenPayload.username,
      });

      await Promise.all([
        Token.create({ ...tokensPair, _user: tokenPayload._id }),
        Token.deleteOne({ refreshToken: oldTokensPare.refreshToken }),
      ]);

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
    _id: string
  ): Promise<void> {
    try {
      const userOldPass = await OldPassword.find({ _user: _id });

      await Promise.all(
        userOldPass.map(async ({ password: hash }) => {
          const isMatched = await passwordService.compare(newPassword, hash);
          if (isMatched) {
            throw new ApiError('Wrong new password', 400);
          }
        })
      );

      const user = await User.findById(_id);

      const isMatched = await passwordService.compare(
        oldPassword,
        user.password
      );

      if (!isMatched) {
        throw new ApiError('Wrong old passport', 400);
      }

      const newPassHash = await passwordService.hash(newPassword);

      await Promise.all([
        OldPassword.create({ password: user.password, _user: user }),
        User.updateOne({ _id }, { password: newPassHash }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async forgotPassword(
    userId: Types.ObjectId,
    email: string
  ): Promise<void> {
    try {
      const forgotPassToken = await tokenService.generateActionToken(
        { _id: userId },
        EActionTokenType.Forgot
      );

      await Promise.all([
        Action.create({
          actionToken: forgotPassToken,
          tokenType: EActionTokenType.Forgot,
          _user: userId,
        }),
        emailService.sendMail(email, EEmailActions.FORGOT_PASSWORD, {
          forgotPassToken,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async setForgotPassword(
    password: string,
    userId: Types.ObjectId,
    actionToken: string
  ): Promise<void> {
    try {
      const hash = await passwordService.hash(password);

      await Promise.all([
        User.findByIdAndUpdate(userId, { password: hash }),
        Action.deleteOne({ actionToken }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
