import {Screenshot} from '../../service/model/screenshot';
import {ErrorResponse} from '../../service/model/error-response';
import {Lecture} from '../../service/model/lecture';

export interface LectureState {

  lectures: Lecture[];
  liveLectures: Lecture[];
  lecturesLoadError: ErrorResponse;

  currentLecture: Lecture;
  currentLectureFetchError: ErrorResponse;
  currentPin: string;

  slides: Screenshot[];
  slidesError: ErrorResponse;
  currentSlideIndex: number;
  snapshotStatus: string; // TODO type
}
