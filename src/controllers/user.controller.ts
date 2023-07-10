import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import multer from 'multer';
import { createReadStream } from 'streamifier';

import { configs } from '../configs';
import { ApiError } from '../errors';
import { userMapper } from '../mapers';
import { User } from '../models';
import { s3Service, userService } from '../services';
import { IUser } from '../types';

class UserController {
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAll();

      const usersForResponse = users.map((user) =>
        userMapper.userForResponse(user)
      );

      return res.status(200).json(usersForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async getByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const userById = await userService.getByUserId(userId);
      const userForResponse = userMapper.userForResponse(userById);

      return res.status(200).json(userForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const updateUser = await userService.update(userId, req.body);
      const userForResponse = userMapper.userForResponse(updateUser);

      return res.status(200).json(userForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async deleteByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;

      await userService.deleteByUserId(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async addPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const photo = req.files.photo as UploadedFile;

      const user = await userService.addPhoto(userId, photo);

      const userForResponse = userMapper.userForResponse(user);

      return res.status(201).json(userForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async deletePhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const user = await userService.deletePhoto(userId);

      const userForResponse = userMapper.userForResponse(user);

      return res.status(200).json(userForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async addVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { userId } = req.params;

      const userFromDB = await User.findById(userId);

      if (userFromDB.video) {
        await s3Service.deleteFile(userFromDB.video, configs.AWS_S3_NAME_VIDEO);
      }

      const upload = multer().single('');

      upload(req, res, async (err) => {
        if (err) {
          throw new ApiError('Download error', err.status);
        }

        const video = req.files.video as UploadedFile;

        const stream = createReadStream(video.data);

        const pathToVideo = await s3Service.uploadVideo(
          stream,
          'user',
          userId,
          video
        );

        const user = await User.findByIdAndUpdate(
          userId,
          { $set: { video: pathToVideo } },
          { new: true }
        );

        const userForResponse = userMapper.userForResponse(user);

        return res.status(201).json(userForResponse);
      });
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }

  public async deleteVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const user = await userService.deleteVideo(userId);

      const userForResponse = userMapper.userForResponse(user);

      return res.status(200).json(userForResponse);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const userController = new UserController();
