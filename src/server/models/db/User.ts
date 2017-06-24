import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

type UserType = 'student' | 'professor';

export interface UserProfile {
  email: string
  type: UserType
}

export interface IUser extends UserProfile, mongoose.Document {
  password: string,
  enabled: boolean,

  generatePasswordHash(password: string),
  validPassword(password: string),
  getUserProfile(): UserProfile
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    unique: true,
    enum: ['student', 'professor'],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  enabled: Boolean
});


// Crypt password
UserSchema.methods.generatePasswordHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(11))
};

// Validate password
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getUserProfile = function (): UserProfile {
  return {
    email: this.email,
    type: this.type,
  }
};

// Db user to JSON user conversion. Remove some data that should not be exposed through the APIs
UserSchema.set('toJSON', { getters: false, virtuals: false });
(<any>UserSchema).options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  delete ret.enabled;
  return ret;
};

export const User = mongoose.model<IUser>('User', UserSchema);
