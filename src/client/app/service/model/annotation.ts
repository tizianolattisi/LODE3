export interface Annotation {
  uuid: string;
  lectureId: string;
  slideId: string;
  type: string;
  userId?: any;
  timestamp: number;

  data?: any;
}
