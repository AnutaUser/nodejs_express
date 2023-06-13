import { ApiError } from '../errors';
import { User } from '../models';
import { IUser } from '../types';

class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(data: IUser): Promise<IUser> {
    try {
      return await User.create(data);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async getByUserId(userId: string): Promise<IUser> {
    return await this.getByIdOrThrow(userId);
  }

  public async update(userId: string, data: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, data, {
      returnDocument: 'after',
    });
  }

  public async deleteByUserId(userId: string): Promise<void> {
    try {
      return await User.findByIdAndRemove(userId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  private async getByIdOrThrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 422);
    }
    return user;
  }
}

export const userService = new UserService();
