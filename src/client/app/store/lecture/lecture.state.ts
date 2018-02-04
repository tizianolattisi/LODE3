import {Screenshot} from '../../service/model/screenshot';
import {ErrorResponse} from '../../service/model/error-response';
import {Lecture} from '../../service/model/lecture';

export type ScreenshotStatus = 'pending' | 'done';

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
  snapshotStatus: ScreenshotStatus;

  dowloadPdfPending: boolean;
  dowloadPdfSuccess: boolean;
  dowloadPdfError: ErrorResponse;
}
