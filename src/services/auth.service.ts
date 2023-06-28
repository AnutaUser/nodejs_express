import { Types } from 'mongoose';

import { EActionTokenType, EEmailActions, EStatus } from '../enums';
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

      const user = await User.create({ ...body, password: hashPass });

      const activateToken = await tokenService.generateActionToken(
        { _id: user._id },
        EActionTokenType.Activate
      );

      await Promise.all([
        Action.create({
          actionToken: activateToken,
          tokenType: EActionTokenType.Activate,
          _user: user._id,
        }),
        emailService.sendMail(body.email, EEmailActions.REGISTER, {
          username: body.username,
          activateToken,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async activate(
    activateToken: string,
    jwtPayload: ITokenPayload
  ): Promise<void> {
    try {
      const { _id } = jwtPayload;

      await Promise.all([
        User.findByIdAndUpdate({ _id }, { status: EStatus.active }),
        Action.deleteMany({ _user: _id, tokenType: EActionTokenType.Activate }),
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
      const [userOldPass, user] = await Promise.all([
        OldPassword.find({ _user: _id }),
        User.findById(_id),
      ]);

      const passwords = [...userOldPass, { password: user.password }];

      await Promise.all(
        passwords.map(async ({ password: hash }) => {
          const isMatched = await passwordService.compare(newPassword, hash);
          if (isMatched) {
            throw new ApiError('Wrong new password', 400);
          }
        })
      );

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
    userId: Types.ObjectId
  ): Promise<void> {
    try {
      const hash = await passwordService.hash(password);

      await Promise.all([
        User.findByIdAndUpdate(userId, { password: hash }),
        Action.deleteMany({
          _user: userId,
          tokenType: EActionTokenType.Forgot,
        }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
