import * as mongoose from 'mongoose';
import {Schema, Types} from 'mongoose';

export interface IAnnotation extends mongoose.Document {
  uuid: string;
  lectureId: string;
  slideId: string;
  type: string; // Type of annotation
  userId: Types.ObjectId;
  timestamp: number; // When the note was taken
  data?: any; // Annotation data
}

const AnnotationSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  lectureId: {
    type: String,
    required: true
  },
  slideId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  data: Schema.Types.Mixed
});

// Db annotation to JSON annotation conversion. Remove some data that should not be exposed through the APIs
AnnotationSchema.set('toJSON', {getters: false, virtuals: false});
(<any>AnnotationSchema).options.toJSON.transform = function (doc, ret, options) {
  // Delete unuseful data
  delete ret._id;
  delete ret.__v;
  delete ret.userId;
  return ret;
};

// Ensure there no exists 2 annotations with the same uuid on the same slide
AnnotationSchema.index({uuid: 1, lectureId: 1, slideId: 1}, {unique: true});


export function isAnnotation(annotation: IAnnotation): annotation is IAnnotation {
  return annotation &&
    annotation.uuid !== undefined &&
    annotation.lectureId !== undefined &&
    annotation.slideId !== undefined &&
    annotation.type !== undefined &&
    annotation.timestamp !== undefined;
}


export const Annotation = mongoose.model<IAnnotation>('Annotation', AnnotationSchema);
