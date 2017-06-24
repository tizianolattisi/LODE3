import * as mongoose from 'mongoose';
import { Schema, Types } from "mongoose";

export interface Lecture extends mongoose.Document {
  uuid: string,
  path: string,
  course?: string,

  videoName?: string,
  videoDate?: Date,
}

const LectureSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  course: String,
  videoName: String,
  videoDate: Date
});

// Db lecture to JSON lecture conversion. Remove some data that should not be exposed through the APIs
LectureSchema.set('toJSON', { getters: false, virtuals: false });
(<any>LectureSchema).options.toJSON.transform = function (doc, ret, options) {
  delete ret._id;
  delete ret.__v;
  delete ret.path;
  delete ret.videoName;
  return ret;
};

LectureSchema.index({ uuid: 1 }, { unique: true });

export const Lecture = mongoose.model<Lecture>('Lecture', LectureSchema);
