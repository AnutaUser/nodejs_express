import { NextFunction, Request, Response } from 'express';

import { photoConfig } from '../configs';
import { ApiError } from '../errors';

class FileMiddleware {
  public isPhotoValid(req: Request, res: Response, next: NextFunction) {
    try {
      if (Array.isArray(req.files.photo)) {
        throw new ApiError('Only one file', 400);
      }

      const { mimetype, size } = req.files.photo;

      if (!photoConfig.MIMETYPE.includes(mimetype)) {
        throw new ApiError('Invalid format', 400);
      }

      if (size > photoConfig.MAX_SIZE) {
        throw new ApiError('Size is too big', 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}
export const fileMiddleware = new FileMiddleware();
