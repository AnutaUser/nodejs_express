import { ApiError } from '../errors';
import { Token, User } from '../models';
import { ICredentials, ITokensPair, IUser } from '../types';
import { passwordService } from './password.service';
import { tokenService } from './token.service';

class AuthService {
  public async register(body: IUser): Promise<void> {
    try {
      const hashPass = await passwordService.hash(body.password);

      await User.create({ ...body, password: hashPass });
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
