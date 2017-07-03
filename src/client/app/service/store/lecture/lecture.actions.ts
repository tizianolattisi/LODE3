import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Store, Action} from '@ngrx/store';
import {AppState} from '../../model/store/app-state';
import {Credentials} from '../../model/credentials';
import {ChangePasswordData} from '../../model/change-password';
import {ChangePasswordWithCodeData} from '../../model/change-password-with-code';
import {ErrorResponse, responseToError} from '../../model/error-response';

export const ADD_SNAPSHOT = '[Lecture] ADD_SNAPSHOT';
export const ADD_SLIDES = '[Lecture] ADD_SLIDES';
export const SET_SLIDES = '[Lecture] SET_SLIDES';
export const SET_CURRENT_SLIDE = '[Lecture] SET_CURRENT_SLIDE';
export const PREV_SLIDE = '[Lecture] PREV_SLIDE';
export const NEXT_SLIDE = '[Lecture] NEXT_SLIDE';
export const GET_SNAPSHOT = '[Lecture] GET_SNAPSHOT';
export const SET_SNAPSHOT_STATUS = '[Lecture] SET_SNAPSHOT_STATUS';

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
}

export class SetSnapshotStatus implements Action {
  readonly type = SET_SNAPSHOT_STATUS;

  constructor(public payload: string) {} // TODO type
}


export type All
  = AddSnapshot
  | AddSlides
  | SetSlides
  | SetCurrentSlide
  | PrevSlide
  | NextSlide
  | GetSnapshot
  | SetSnapshotStatus;
