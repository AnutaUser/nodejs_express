import { IUser } from './user.types';

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export type ICredentials = Pick<IUser, 'email' | 'password'>;

export type ITokenPayload = Pick<IUser, 'username' | '_id'>;
