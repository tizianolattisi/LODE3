import * as mongoose from 'mongoose';
import uuid = require('node-uuid');
import { Schema, Types } from "mongoose";

export interface IConfirmCode extends mongoose.Document {
  uid: Types.ObjectId,
  code: string,

  generateConfirmCode(): string
}

const ConfirmCodeSchema = new mongoose.Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true
  },
  code: {
    type: String,
    required: true
  },
});

ConfirmCodeSchema.methods.generateConfirmCode = function (): string {
  return uuid.v4();
};

export const ConfirmCode = mongoose.model<IConfirmCode>('ConfirmCode', ConfirmCodeSchema);
