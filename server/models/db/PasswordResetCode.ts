import * as mongoose from 'mongoose';
import uuid = require('node-uuid');

export interface IPasswordResetCode extends mongoose.Document {
    email: string,
    code: string,
    expiration: Date

    generatePasswordResetCode(): string,
    getNewExpirationDate(): Date,
    isExpired(): boolean
}

var PasswordResetCodeSchema = new mongoose.Schema({
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

/* -----
 * Methods
 ----- */

PasswordResetCodeSchema.methods.generatePasswordResetCode = function (): string {
    return uuid.v4() + uuid.v4();
};

PasswordResetCodeSchema.methods.getNewExpirationDate = function (): Date {
    let exp = new Date();
    exp.setMinutes(exp.getMinutes() + 30);
    return exp;
};

PasswordResetCodeSchema.methods.isExpired = function (): boolean {
    return (new Date() > this.expiration);
};

export var PasswordResetCode = mongoose.model<IPasswordResetCode>('PasswordResetCode', PasswordResetCodeSchema);