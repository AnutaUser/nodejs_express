import { EEmailActions } from '../enums';
import { ApiError } from '../errors';
import { Token, User } from '../models';
import { ICredentials, ITokensPair, IUser } from '../types';
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

      await Token.create({ ...tokensPair, _userId: user._id });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
