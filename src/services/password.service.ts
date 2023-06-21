import { compare, hash } from 'bcrypt';

import { configs } from '../configs';

class PasswordService {
  public async hash(password: string): Promise<string> {
    return await hash(password, +configs.BCRYPT_SALT);
  }

  public async compare(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    return await compare(password, hashPassword);
  }
}

export const passwordService = new PasswordService();
