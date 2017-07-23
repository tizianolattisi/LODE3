import {ErrorResponse} from '../../error-response';
import {Lecture} from '../../lecture';

export interface LectureState {

  lectures: Lecture[];
  liveLectures: Lecture[];
  lecturesLoadError: ErrorResponse;

  lectureId: string;
  slides: string[]; // TODO type
  currentSlideIndex: number;
  snapshotStatus: string; // TODO type
}
