import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';
import {Schema, Types} from 'mongoose';

export interface IConfirmCode extends mongoose.Document {
  uid: Types.ObjectId;
  code: string;

  generateConfirmCode(): string;
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
  return uuidv4();
};

export const ConfirmCode = mongoose.model<IConfirmCode>('ConfirmCode', ConfirmCodeSchema);
