import { UploadedFile } from 'express-fileupload';

import { configs } from '../configs';
import { ApiError } from '../errors';
import { User } from '../models';
import { IUser } from '../types';
import { s3Service } from './s3.service';

class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return await User.find();
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

  public async addPhoto(userId: string, photo: UploadedFile): Promise<IUser> {
    try {
      const user = await this.getByIdOrThrow(userId);

      if (user.photo) {
        await s3Service.deleteFile(user.photo, configs.AWS_S3_NAME_PHOTO);
      }

      const userPhoto = await s3Service.uploadFile(photo, 'user', userId);

      return await User.findByIdAndUpdate(
        userId,
        { $set: { photo: userPhoto } },
        { new: true }
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async deletePhoto(userId: string): Promise<IUser> {
    try {
      const user = await this.getByIdOrThrow(userId);

      if (!user.photo) {
        return user;
      }

      await s3Service.deleteFile(user.photo, configs.AWS_S3_NAME_PHOTO);

      return await User.findByIdAndUpdate(
        userId,
        { $unset: { photo: user.photo } },
        { new: true }
      );
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async deleteVideo(userId: string): Promise<IUser> {
    try {
      const user = await this.getByIdOrThrow(userId);

      if (!user.video) {
        return user;
      }

      await s3Service.deleteFile(user.video, configs.AWS_S3_NAME_VIDEO);

      return await User.findByIdAndUpdate(
        userId,
        { $unset: { video: user.video } },
        { new: true }
      );
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
