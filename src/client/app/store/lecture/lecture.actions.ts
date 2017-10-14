import {ErrorResponse} from '../../service/model/error-response';
import {Action} from '@ngrx/store';
import {Lecture} from '../../service/model/lecture';
import {Screenshot} from '../../service/model/screenshot';


export const UPDATE_LECTURE_LIST = '[Lecture] UPDATE_LECTURE_LIST';
export const UPDATE_LECTURE_LIST_ERROR = '[Lecture] UPDATE_LECTURE_LIST_ERROR';
export const SET_LECTURE_LIST = '[Lecture] SET_LECTURE_LIST';

export const FETCH_LECTURE = '[Lecture] FETCH_LECTURE';
export const FETCH_LECTURE_ERROR = '[Lecture] FETCH_LECTURE_ERROR';
export const SET_CURRENT_LECTURE = '[Lecture] SET_CURRENT_LECTURE';
export const SET_CURRENT_PIN = '[Lecture] SET_CURRENT_PIN';

export const FETCH_USER_SCREENSHOTS = '[Lecture] FETCH_USER_SCREENSHOTS';
export const FETCH_USER_SCREENSHOTS_ERROR = '[Lecture] FETCH_USER_SCREENSHOTS_ERROR';
export const SET_USER_SCREENSHOTS = '[Lecture] SET_USER_SCREENSHOTS';
export const SET_USER_SCREENSHOTS_IMG = '[Lecture] SET_USER_SCREENSHOTS_IMG';

export const ADD_SNAPSHOT = '[Lecture] ADD_SNAPSHOT';
export const ADD_SLIDES = '[Lecture] ADD_SLIDES';
export const SET_SLIDES = '[Lecture] SET_SLIDES';
export const SET_CURRENT_SLIDE = '[Lecture] SET_CURRENT_SLIDE';
export const PREV_SLIDE = '[Lecture] PREV_SLIDE';
export const NEXT_SLIDE = '[Lecture] NEXT_SLIDE';
export const GET_SNAPSHOT = '[Lecture] GET_SNAPSHOT';
export const SET_SNAPSHOT_STATUS = '[Lecture] SET_SNAPSHOT_STATUS';


// Lecture list //////////////////////////////////////////////////////

export class UpdateLectureList implements Action {
  readonly type = UPDATE_LECTURE_LIST;
}

export class SetLectureList implements Action {
  readonly type = SET_LECTURE_LIST;

  constructor(public payload: {live: Lecture[], lectures: Lecture[]}) {}
}

export class UpdateLectureListError implements Action {
  readonly type = UPDATE_LECTURE_LIST_ERROR;

  constructor(public payload: ErrorResponse) {}
}

// Specific lecture info ////////////////////////////////////////////

export class FetchLecture implements Action {
  readonly type = FETCH_LECTURE;

  constructor(public payload: string) {}
}

export class FetchLectureError implements Action {
  readonly type = FETCH_LECTURE_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class SetCurrentLecture implements Action {
  readonly type = SET_CURRENT_LECTURE;

  constructor(public payload: Lecture) {}
}

export class SetCurrentPin implements Action {
  readonly type = SET_CURRENT_PIN;

  constructor(public payload: string) {}
}

// User screenshots ///////////////////////////////////////////////

export class FetchUserScreenshots implements Action {
  readonly type = FETCH_USER_SCREENSHOTS;

  constructor(public payload: string) {}
}

export class FetchUserScreenshotsError implements Action {
  readonly type = FETCH_USER_SCREENSHOTS_ERROR;

  constructor(public payload: ErrorResponse) {}
}

export class SetUserScreenshots implements Action {
  readonly type = SET_USER_SCREENSHOTS;

  constructor(public payload: Screenshot[]) {}
}

export class SetUserScreenshotsImg implements Action {
  readonly type = SET_USER_SCREENSHOTS_IMG;

  constructor(public payload: Screenshot[]) {}
}


// Screenshot take actions ///////////////////////////////////////////

export class AddSnapshot implements Action {
  readonly type = ADD_SNAPSHOT;

  constructor(public payload: string) {}
}

export class AddSlides implements Action {
  readonly type = ADD_SLIDES;

  constructor(public payload: string[]) {}
}

export class SetSlides implements Action {
  readonly type = SET_SLIDES;

  constructor(public payload: string[]) {}
}

export class SetCurrentSlide implements Action {
  readonly type = SET_CURRENT_SLIDE;

  constructor(public payload: number) {}
}

export class PrevSlide implements Action {
  readonly type = PREV_SLIDE;
}

export class NextSlide implements Action {
  readonly type = NEXT_SLIDE;
}

export class GetSnapshot implements Action {
  readonly type = GET_SNAPSHOT;

  constructor(public payload: {lectureId: string; pin: string}) {}
}

export class SetSnapshotStatus implements Action {
  readonly type = SET_SNAPSHOT_STATUS;

  constructor(public payload: string) {} // TODO type
}


export type All
  = UpdateLectureList
  | SetLectureList
  | UpdateLectureListError
  | FetchLecture
  | FetchLectureError
  | SetCurrentLecture
  | SetCurrentPin
  | FetchUserScreenshots
  | FetchUserScreenshotsError
  | SetUserScreenshots
  | SetUserScreenshotsImg
  | AddSnapshot
  | AddSlides
  | SetSlides
  | SetCurrentSlide
  | PrevSlide
  | NextSlide
  | GetSnapshot
  | SetSnapshotStatus;
