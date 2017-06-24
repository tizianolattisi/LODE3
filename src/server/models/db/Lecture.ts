import * as mongoose from 'mongoose';
import {DocumentArray} from 'mongoose/lib/types/documentarray';

export interface ILecture {
  uuid: string;
  course?: string;
  name?: string;
  live: boolean;

  videoFileName?: string;
  videoDate?: Date;

  screenshots?: DocumentArray<Screenshot>;
}

export interface Lecture extends ILecture, mongoose.Document {
}

export interface IScreenshot {
  fileName: string;
  name?: string;
  timestamp: number;
  img?: string;
}

export interface IScreenshotComplete extends IScreenshot {
  img?: string;
}

export interface Screenshot extends IScreenshot, mongoose.Document {
}


const ScreenshotSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  name: String,
  timestamp: {
    type: Number,
    required: true
  }
});


const LectureSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  name: String,
  course: String,
  live: Boolean,

  videoFileName: String,
  videoDate: Date,

  screenshots: [ScreenshotSchema]
});


// Db lecture to JSON lecture conversion. Remove some data that should not be exposed through the APIs
LectureSchema.set('toJSON', {getters: false, virtuals: false});
(<any>LectureSchema).options.toJSON.transform = function (doc, ret, options) {
  delete ret._id;
  delete ret.__v;
  delete ret.videoFileName;
  delete ret.screenshots;
  return ret;
};

LectureSchema.index({uuid: 1}, {unique: true});
// LectureSchema.index({'screenshots.id': 1}, {unique: true, sparse: true}); // TODO apply constraints

export const Lecture = mongoose.model<Lecture>('Lecture', LectureSchema);
