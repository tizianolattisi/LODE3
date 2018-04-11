export type DataType = NoteData | PencilData | BookmarkData;

export interface Annotation<T extends DataType> {
  uuid: string;
  lectureId: string;
  slideId: string;
  type: string;
  userId?: any;
  timestamp: number;

  data?: T;
}

export interface NoteData {
  x: number;
  y: number;
  text: string;
  title: string;
  color: string;
}

export interface PencilData {
  path: string;
  color: string;
  width: number;
}

export interface BookmarkData {
  x: number;
  y: number;
  title: string;
  color: string;
}
