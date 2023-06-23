import { model, Schema, Types } from 'mongoose';

import { EActionTokenType } from '../enums';
import { User } from './User.model';

const actionSchema = new Schema({
  actionToken: {
    type: String,
    required: true,
  },
  tokenType: {
    type: String,
    required: true,
    enum: EActionTokenType,
  },
  _user: {
    type: Types.ObjectId,
    required: true,
    ref: User,
  },
});

export const Action = model('action', actionSchema);
