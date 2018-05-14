import { ScreenshotStatus } from './lecture.state';
import { ErrorResponse } from '../../service/model/error-response';
import { Action } from '@ngrx/store';
import { Lecture } from '../../service/model/lecture';
import { Screenshot } from '../../service/model/screenshot';


export const enum ActionTypes {
  UPDATE_LECTURE_LIST = '[Lecture] UPDATE_LECTURE_LIST',
  UPDATE_LECTURE_LIST_ERROR = '[Lecture] UPDATE_LECTURE_LIST_ERROR',
  SET_LECTURE_LIST = '[Lecture] SET_LECTURE_LIST',

  FETCH_LECTURE = '[Lecture] FETCH_LECTURE',
  FETCH_LECTURE_BY_NAME = '[Lecture] FETCH_LECTURE_BY_NAME',
  FETCH_LECTURE_ERROR = '[Lecture] FETCH_LECTURE_ERROR',
  SET_CURRENT_LECTURE = '[Lecture] SET_CURRENT_LECTURE',
  SET_CURRENT_PIN = '[Lecture] SET_CURRENT_PIN',

  FETCH_USER_SCREENSHOTS = '[Lecture] FETCH_USER_SCREENSHOTS',
  FETCH_USER_SCREENSHOTS_ERROR = '[Lecture] FETCH_USER_SCREENSHOTS_ERROR',
  SET_USER_SCREENSHOTS = '[Lecture] SET_USER_SCREENSHOTS',
  SET_USER_SCREENSHOTS_IMG = '[Lecture] SET_USER_SCREENSHOTS_IMG',

  ADD_SCREENSHOT = '[Lecture] ADD_SCREENSHOT',
  GET_SCREENSHOT_COMPLETE = '[Lecture] GET_SCREENSHOT_COMPLETE',
  GET_SCREENSHOT_ERROR = '[Lecture] GET_SCREENSHOT_ERROR',
  SET_SLIDES = '[Lecture] SET_SLIDES',
  SET_CURRENT_SLIDE = '[Lecture] SET_CURRENT_SLIDE',
  PREV_SLIDE = '[Lecture] PREV_SLIDE',
  NEXT_SLIDE = '[Lecture] NEXT_SLIDE',
  GET_SCREENSHOT = '[Lecture] GET_SCREENSHOT',
  GET_BLANK_PAGE = '[Lecture] GET_BLANK_PAGE',
  SET_SCREENSHOT_STATUS = '[Lecture] SET_SCREENSHOT_STATUS',

  DOWNLOAD_PDF = '[Lecture] DOWNLOAD_PDF',
  DOWNLOAD_PDF_SUCCESS = '[Lecture] DOWNLOAD_PDF_SUCCESS',
  DOWNLOAD_PDF_ERROR = '[Lecture] DOWNLOAD_PDF_ERROR'
};


// Lecture list //////////////////////////////////////////////////////

export class UpdateLectureList implements Action {
  readonly type = ActionTypes.UPDATE_LECTURE_LIST;
}

export class SetLectureList implements Action {
  readonly type = ActionTypes.SET_LECTURE_LIST;

  constructor(public payload: { live: Lecture[], lectures: Lecture[] }) { }
}

export class UpdateLectureListError implements Action {
  readonly type = ActionTypes.UPDATE_LECTURE_LIST_ERROR;

  constructor(public payload: ErrorResponse) { }
}

// Specific lecture info ////////////////////////////////////////////

export class FetchLecture implements Action {
  readonly type = ActionTypes.FETCH_LECTURE;

  constructor(public payload: string) { }
}

export class FetchLectureByName implements Action {
  readonly type = ActionTypes.FETCH_LECTURE_BY_NAME;

  constructor(public payload: { course: string, title: string }) { }
}

export class FetchLectureError implements Action {
  readonly type = ActionTypes.FETCH_LECTURE_ERROR;

  constructor(public payload: ErrorResponse) { }
}

export class SetCurrentLecture implements Action {
  readonly type = ActionTypes.SET_CURRENT_LECTURE;

  constructor(public payload: Lecture) { }
}

export class SetCurrentPin implements Action {
  readonly type = ActionTypes.SET_CURRENT_PIN;

  constructor(public payload: string) { }
}

// User screenshots ///////////////////////////////////////////////

export class FetchUserScreenshots implements Action {
  readonly type = ActionTypes.FETCH_USER_SCREENSHOTS;

  constructor(public payload: string) { }
}

export class FetchUserScreenshotsError implements Action {
  readonly type = ActionTypes.FETCH_USER_SCREENSHOTS_ERROR;

  constructor(public payload: ErrorResponse) { }
}

export class SetUserScreenshots implements Action {
  readonly type = ActionTypes.SET_USER_SCREENSHOTS;

  constructor(public payload: Screenshot[]) { }
}

export class SetUserScreenshotsImg implements Action {
  readonly type = ActionTypes.SET_USER_SCREENSHOTS_IMG;

  constructor(public payload: Screenshot[]) { }
}


// Screenshot take actions ///////////////////////////////////////////

export class AddScreenshot implements Action {
  readonly type = ActionTypes.ADD_SCREENSHOT;

  constructor(public payload: string) { }
}

export class GetScreenshotComplete implements Action {
  readonly type = ActionTypes.GET_SCREENSHOT_COMPLETE;

  constructor(public payload: Screenshot) { }
}

export class GetScreenshotError implements Action {
  readonly type = ActionTypes.GET_SCREENSHOT_ERROR;

  constructor(public payload: any) { }
}

export class SetSlides implements Action {
  readonly type = ActionTypes.SET_SLIDES;

  constructor(public payload: Screenshot[]) { }
}

export class SetCurrentSlide implements Action {
  readonly type = ActionTypes.SET_CURRENT_SLIDE;

  constructor(public payload: number) { }
}

export class PrevSlide implements Action {
  readonly type = ActionTypes.PREV_SLIDE;
}

export class NextSlide implements Action {
  readonly type = ActionTypes.NEXT_SLIDE;
}

export class GetScreenshot implements Action {
  readonly type = ActionTypes.GET_SCREENSHOT;

  constructor(public payload: { lectureId: string; pin: string }) { }
}

export class GetBlankPage implements Action {
  readonly type = ActionTypes.GET_BLANK_PAGE;

  constructor(public payload: { lectureId: string; pin: string }) { }
}

export class SetScreenshotStatus implements Action {
  readonly type = ActionTypes.SET_SCREENSHOT_STATUS;

  constructor(public payload: ScreenshotStatus) { }
}

// Pdf download //////////////////////////////////////////////

export class DownloadPdf implements Action {
  readonly type = ActionTypes.DOWNLOAD_PDF;
}

export class DownloadPdfSuccess implements Action {
  readonly type = ActionTypes.DOWNLOAD_PDF_SUCCESS;
}

export class DownloadPdfError implements Action {
  readonly type = ActionTypes.DOWNLOAD_PDF_ERROR;

  constructor(public payload: ErrorResponse) { }
}



export type All
  = UpdateLectureList
  | SetLectureList
  | UpdateLectureListError
  | FetchLecture
  | FetchLectureByName
  | FetchLectureError
  | SetCurrentLecture
  | SetCurrentPin
  | FetchUserScreenshots
  | FetchUserScreenshotsError
  | SetUserScreenshots
  | SetUserScreenshotsImg
  | AddScreenshot
  | GetScreenshotComplete
  | GetScreenshotError
  | SetSlides
  | SetCurrentSlide
  | PrevSlide
  | NextSlide
  | GetScreenshot
  | GetBlankPage
  | SetScreenshotStatus
  | DownloadPdf
  | DownloadPdfSuccess
  | DownloadPdfError;
