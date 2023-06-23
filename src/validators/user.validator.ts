import Joi from 'joi';

import { regexConstant } from '../constants';
import { EGender, EStatus } from '../enums';

export class UserValidator {
  static username = Joi.string().min(3).max(15).trim();
  static age = Joi.number().min(16).max(130);
  static gender = Joi.valid(...Object.values(EGender));
  static email = Joi.string()
    .regex(regexConstant.EMAIL)
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Це поле обовязкове',
      'string.email': 'Адрес электронної почты має невірний формат',
    });
  static password = Joi.string().regex(regexConstant.PASSWORD).trim();
  static phone = Joi.string().regex(regexConstant.PHONE).trim();
  static status = Joi.valid(...Object.values(EStatus));
  static photo = Joi.string();

  static create = Joi.object({
    username: this.username.required(),
    age: this.age.required(),
    gender: this.gender.required(),
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone.required(),
    status: this.status,
    photo: this.photo,
  });

  static update = Joi.object({
    username: this.username,
    age: this.age,
    gender: this.gender,
    photo: this.photo,
  });

  static login = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  static changePassword = Joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });

  static forgotPassword = Joi.object({
    email: this.email.required(),
  });

  static setForgotPassword = Joi.object({
    password: this.password.required(),
  });
}
