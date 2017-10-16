import * as AnnotationActions from './annotation.actions';
import {AnnotationState} from './annotation.state';

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
        annotations: annss
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
