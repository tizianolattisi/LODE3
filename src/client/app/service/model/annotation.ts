
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
}

export interface PencilData {
  path: string;
}
