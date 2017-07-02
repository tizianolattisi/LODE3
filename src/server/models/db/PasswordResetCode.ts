import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export interface IPasswordResetCode extends mongoose.Document {
  email: string,
  code: string,
  expiration: Date

  generatePasswordResetCode(): string,
  getNewExpirationDate(): Date,
  isExpired(): boolean
}

const PasswordResetCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  expiration: {
    type: Date,
    required: true
  }
});

PasswordResetCodeSchema.methods.generatePasswordResetCode = function (): string {
  return uuidv4() + uuidv4();
};

PasswordResetCodeSchema.methods.getNewExpirationDate = function (): Date {
  const exp = new Date();
  exp.setMinutes(exp.getMinutes() + 30);
  return exp;
};

PasswordResetCodeSchema.methods.isExpired = function (): boolean {
  return (new Date() > this.expiration);
};

export const PasswordResetCode = mongoose.model<IPasswordResetCode>('PasswordResetCode', PasswordResetCodeSchema);
