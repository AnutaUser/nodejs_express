import express, { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';

import { configs } from './configs';
import { User } from './models';
import { IUser } from './types';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  '/users',
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }
);

app.post(
  '/users',
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> => {
    try {
      const createdUser = await User.create(req.body);
      return res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  }
);

app.get(
  '/users/:userId',
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> => {
    try {
      const { userId } = req.params;
      const userById = await User.findById(userId);

      return res.status(200).json(userById);
    } catch (e) {
      next(e);
    }
  }
);

app.put(
  '/users/:userId',
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> => {
    try {
      const { userId } = req.params;
      const body = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, body, {
        returnDocument: 'after',
      });
      return res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
);

app.delete(
  '/users/:userId',
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> => {
    try {
      const { userId } = req.params;

      await User.findByIdAndRemove(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  // eslint-disable-next-line no-console
  console.log(`started on PORT: ${configs.PORT} 😉`);
});
