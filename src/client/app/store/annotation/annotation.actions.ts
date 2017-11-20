import {Action} from '@ngrx/store';
import {Annotation, DataType} from '../../service/model/annotation';
import {AnnotationSearch} from '../../service/model/annotation-search';

export enum ActionTypes {
  FETCH_ANNOTATIONS = '[Annotation] FETCH_ANNOTATIONS',
  SET_ANNOTATIONS = '[Annotation] SET_ANNOTATIONS',
  SET_ANNOTATIONS_PER_SLIDE = '[Annotation] SET_ANNOTATIONS_PER_SLIDE',
  RESET_SELECTION = '[Annotation] RESET_SELECTION',
  TOGGLE_SELECTED_ANNOTATION = '[Annotation] TOGGLE_SELECTED_ANNOTATION',
  SET_SELECTED = '[Annotation] SET_SELECTED',
  ADD_ANNOTATION = '[Annotation] ADD_ANNOTATION',
  EDIT_ANNOTATION = '[Annotation] EDIT_ANNOTATION',
  DELETE_ANNOTATION = '[Annotation] DELETE_ANNOTATION',
  CLEAR_ANNOTATIONS_WORKSPACE = '[Annotation] CLEAR_ANNOTATIONS_WORKSPACE'
};


export class FetchAnnotations implements Action {
  readonly type = ActionTypes.FETCH_ANNOTATIONS;

  constructor(public payload: AnnotationSearch) {}
}

export class SetAnnotations implements Action {
  readonly type = ActionTypes.SET_ANNOTATIONS;

  constructor(public payload: {[slideId: string]: {[uuid: string]: Annotation<DataType>}}) {}
}

export class SetAnnotationsPerSlide implements Action {
  readonly type = ActionTypes.SET_ANNOTATIONS_PER_SLIDE;

  constructor(public payload: {slideId: string; annotations: {[uuid: string]: Annotation<DataType>}}) {}
}

export class ResetSelection implements Action {
  readonly type = ActionTypes.RESET_SELECTION;
}

export class ToggleSelection implements Action {
  readonly type = ActionTypes.TOGGLE_SELECTED_ANNOTATION;

  constructor(public payload: string) {}
}

export class SetSelected implements Action {
  readonly type = ActionTypes.SET_SELECTED;

  constructor(public payload: string) {}
}

export class AddAnnotation implements Action {
  readonly type = ActionTypes.ADD_ANNOTATION;

  constructor(public payload: Annotation<DataType>) {}
}

export class EditAnnotation implements Action {
  readonly type = ActionTypes.EDIT_ANNOTATION;

  constructor(public payload: Annotation<DataType>) {}
}

export class DeleteAnnotation implements Action {
  readonly type = ActionTypes.DELETE_ANNOTATION;

  constructor(public payload: {lectureId: string, slideId: string, annotationId: string}) {}
}

export class ClearAnnotationWorkspace implements Action {
  readonly type = ActionTypes.CLEAR_ANNOTATIONS_WORKSPACE;
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
  | DeleteAnnotation
  | ClearAnnotationWorkspace;
