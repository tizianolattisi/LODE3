import {ErrorResponse} from '../../service/model/error-response';
import {Lecture} from '../../service/model/lecture';

export interface LectureState {

  lectures: Lecture[];
  liveLectures: Lecture[];
  lecturesLoadError: ErrorResponse;

  currentLecture: Lecture;
  currentLectureFetchError: ErrorResponse;
  currentPin: string;

  slides: string[]; // TODO type
  currentSlideIndex: number;
  snapshotStatus: string; // TODO type
}
