import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  username?: string;
  age?: number;
  gender?: string;
  email?: string;
  password?: string;
  phone?: string;
  status: string;
  photo?: string;
}

export type IUserWithoutPass = Omit<IUser, 'password'>;
