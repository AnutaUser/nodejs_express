import { model, Schema } from 'mongoose';

import { EGender, EStatus } from '../enums';

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    age: {
      type: Number,
      min: [16, 'Min value: 16'],
      max: [130, 'Max value: 130'],
    },
    gender: {
      type: String,
      enum: EGender,
    },
    email: {
      type: String,
      unique: true,
      require: true,
      trim: true,
      toLowerCase: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      trim: true,
    },
    status: {
      type: String,
      enum: EStatus,
      default: EStatus.inactive,
    },
    photo: {
      type: String,
      require: false,
    },
    video: {
      type: String,
      require: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model('user', userSchema);
