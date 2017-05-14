import * as mongoose from 'mongoose';
import  bcrypt = require('bcryptjs');
import {Schema, Types} from "mongoose";

export interface IAnnotation extends mongoose.Document {
    uuid: string,
    pdfId: string,
    pageNumber: number,
    type: string,
    time: number,
    timestamp?: Date,
    uid: Types.ObjectId,
    scales: { origLeft: number, origTop: number, origScaleX: number, origScaleY: number },
    data: any
}

var AnnotationSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    pdfId: {
        type: String,
        required: true
    },
    pageNumber: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    time: Number,
    timestamp: Date,
    uid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    scales: {
        origLeft: Number,
        origTop: Number,
        origScaleX: Number,
        origScaleY: Number
    },
    data: Schema.Types.Mixed
});

/* -----
 * Methods
 ----- */

// crypt password
AnnotationSchema.methods.generatePasswordHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(11))
};

AnnotationSchema.set('toJSON', {getters: false, virtuals: false});
(<any>AnnotationSchema).options.toJSON.transform = function (doc, ret, options) {
    // delete not useful data
    delete ret._id;
    delete ret.__v;
    delete ret.uid;
    delete ret.timestamp;
    return ret;
};

AnnotationSchema.index({uuid: 1, pdfId: 1}, {unique: true});

export var Annotation = mongoose.model<IAnnotation>('Annotation', AnnotationSchema);