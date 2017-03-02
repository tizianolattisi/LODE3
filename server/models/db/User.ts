import bcrypt = require('bcryptjs');
import * as mongoose from 'mongoose';


export interface IUser extends IUserProfile, mongoose.Document {
    password: string,
    enabled: boolean,

    generatePasswordHash(password: string),
    validPassword(password: string),
    getUserProfile(): IUserProfile
}

export interface IUserProfile {
    email: string
}

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    enabled: Boolean
});

/* -----
 * Methods
 ----- */

// crypt password
UserSchema.methods.generatePasswordHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(11))
};

// validate password
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getUserProfile = function (): IUserProfile {
    return {
        email: this.email
    }
};


export var User = mongoose.model<IUser>('User', UserSchema);