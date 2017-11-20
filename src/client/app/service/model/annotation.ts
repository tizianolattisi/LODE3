export type DataType = NoteData | PencilData;

export interface Annotation {
  uuid: string;
  lectureId: string;
  slideId: string;
  type: string;
  userId?: any;
  timestamp: number;

  data?: DataType;
}

export interface NoteData {
  x: number;
  y: number;
  text: string;
  title: string;
}

export interface PencilData {
  path: string;
  color: string;
  width: number;
}
