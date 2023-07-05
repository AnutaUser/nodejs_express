import { configs } from '../configs';
import { IUser } from '../types';

class UserMapper {
  public userForResponse(user: IUser) {
    return {
      _id: user._id,
      username: user.username,
      age: user.age,
      gender: user.gender,
      email: user.email,
      phone: user.phone,
      status: user.status,
      photo: user.photo ? `${configs.AWS_S3_URL}/${user.photo}` : null,
      video: user.video ? `${configs.AWS_S3_URL_VIDEO}/${user.video}` : null,
    };
  }
}

export const userMapper = new UserMapper();
