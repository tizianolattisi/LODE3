import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Store, Action} from '@ngrx/store';
import {AppState} from '../../model/store/app-state';
import {Credentials} from '../../model/credentials';
import {ChangePasswordData} from '../../model/change-password';
import {ChangePasswordWithCodeData} from '../../model/change-password-with-code';
import {ErrorResponse, responseToError} from '../../model/error-response';

export const FETCH_ANNOTATIONS = '[Annotation] FETCH_ANNOTATIONS';
export const SET_ANNOTATIONS = '[Annotation] SET_ANNOTATIONS';
export const SET_ANNOTATIONS_PER_SLIDE = '[Annotation] SET_ANNOTATIONS_PER_SLIDE';
export const RESET_SELECTION = '[Annotation] RESET_SELECTION';
export const TOGGLE_SELECTED_ANNOTATION = '[Annotation] TOGGLE_SELECTED_ANNOTATION';
export const SET_SELECTED = '[Annotation] SET_SELECTED';
export const ADD_ANNOTATION = '[Annotation] ADD_ANNOTATION';
export const EDIT_ANNOTATION = '[Annotation] EDIT_ANNOTATION';
export const DELETE_ANNOTATION = '[Annotation] DELETE_ANNOTATION';

export class FetchAnnotations implements Action {
  readonly type = FETCH_ANNOTATIONS;

  constructor(public payload: any) {} // TODO lectureId + slideId
}

export class SetAnnotations implements Action {
  readonly type = SET_ANNOTATIONS;

  constructor(public payload: any) {} // TODO type (annotations + slideId)
}

export class SetAnnotationsPerSlide implements Action {
  readonly type = SET_ANNOTATIONS_PER_SLIDE;

  constructor(public payload: any) {} // TODO type
}

export class ResetSelection implements Action {
  readonly type = RESET_SELECTION;
}

export class ToggleSelection implements Action {
  readonly type = TOGGLE_SELECTED_ANNOTATION;

  constructor(public payload: string) {}
}

export class SetSelected implements Action {
  readonly type = SET_SELECTED;

  constructor(public payload: string) {}
}

export class AddAnnotation implements Action {
  readonly type = ADD_ANNOTATION;

  constructor(public payload: any) {} // TODO type
}

export class EditAnnotation implements Action {
  readonly type = EDIT_ANNOTATION;

  constructor(public payload: any) {} // TODO type
}

export class DeleteAnnotation implements Action {
  readonly type = DELETE_ANNOTATION;

  constructor(public payload: any) {} // TODO lectureId, annotationId
}

export type All
  = FetchAnnotations
  | SetAnnotations
  | SetAnnotationsPerSlide
  | ResetSelection
  | ToggleSelection
  | SetSelected
  | AddAnnotation
  | EditAnnotation
  | DeleteAnnotation;
