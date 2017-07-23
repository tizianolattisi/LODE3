import {AnnotationState} from '../../model/store/states/annotation.state';
import * as AnnotationActions from './annotation.actions';

export type Action = AnnotationActions.All;


const initialState: AnnotationState = {
  annotations: {},
  selectedAnnotations: [],
  fetchedSlides: []
}

export function annotationReducer(state: AnnotationState = initialState, action: Action): AnnotationState {

  switch (action.type) {

    case AnnotationActions.FETCH_ANNOTATIONS:
      return state;

    case AnnotationActions.SET_ANNOTATIONS:
      return {
        ...state,
        annotations: {...state.annotations, ...action.payload.annotations}, // TODO user correct prop
        fetchedSlides: [...state.fetchedSlides, action.payload.slideId] // TODO user correct prop
      };

    case AnnotationActions.SET_ANNOTATIONS_PER_SLIDE:
      return {
        ...state,
        annotations: {...state.annotations, ...action.payload.annotations}, // TODO user correct prop
        fetchedSlides: [...state.fetchedSlides, action.payload.slideId] // TODO user correct prop
      };

    case AnnotationActions.RESET_SELECTION:
      return {
        ...state,
        selectedAnnotations: []
      };

    case AnnotationActions.TOGGLE_SELECTED_ANNOTATION:
      return {
        ...state,
        selectedAnnotations: state.selectedAnnotations.filter(uuid => uuid !== action.payload)
      };

    case AnnotationActions.SET_SELECTED:
      return {
        ...state,
        selectedAnnotations: [...state.selectedAnnotations, action.payload]
      };

    case AnnotationActions.ADD_ANNOTATION:
      const anns = {...state.annotations};
      // TODO add annotaton
      return {
        ...state,
        annotations: anns
      };

    case AnnotationActions.EDIT_ANNOTATION:
      const annss = {...state.annotations};
      // TODO edit annotaton
      return {
        ...state,
        annotations: anns
      };

    case AnnotationActions.DELETE_ANNOTATION:
      // TODO delete annotation
      return {
        ...state,
        annotations: anns
      };

    default:
      return state;
  }
}

export const FETCH_ANNOTATIONS = '[Annotation] FETCH_ANNOTATIONS';
export const SET_ANNOTATIONS = '[Annotation] SET_ANNOTATIONS';
export const SET_ANNOTATIONS_PER_SLIDE = '[Annotation] SET_ANNOTATIONS_PER_SLIDE';
export const RESET_SELECTION = '[Annotation] RESET_SELECTION';
export const TOGGLE_SELECTED_ANNOTATION = '[Annotation] TOGGLE_SELECTED_ANNOTATION';
export const SET_SELECTED = '[Annotation] SET_SELECTED';
export const ADD_ANNOTATION = '[Annotation] ADD_ANNOTATION';
export const EDIT_ANNOTATION = '[Annotation] EDIT_ANNOTATION';
export const DELETE_ANNOTATION = '[Annotation] DELETE_ANNOTATION';

