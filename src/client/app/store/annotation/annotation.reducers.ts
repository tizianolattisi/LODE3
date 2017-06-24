import {AnnotationState} from './annotation.state';
import {ActionTypes, All} from './annotation.actions';


const initialState: AnnotationState = {
  annotations: {},
  selectedAnnotations: [],
  fetchedSlides: []
}

export function annotationReducer(state: AnnotationState = initialState, action: All): AnnotationState {

  switch (action.type) {

    case ActionTypes.SET_ANNOTATIONS:

      return {
        ...state,
        annotations: action.payload,
        fetchedSlides: Object.keys(action.payload)
      };

    case ActionTypes.SET_ANNOTATIONS_PER_SLIDE:

      // Copy annotations
      const annotations = {...state.annotations};

      // If not exists, add "bucket" for annotations in the slide
      if (!annotations[action.payload.slideId]) {
        annotations[action.payload.slideId] = {};
      }

      // Update annotations for the slide
      annotations[action.payload.slideId] = {...annotations[action.payload.slideId], ...action.payload.annotations};

      // Update fetched slides
      const _fetchedSlides = [...state.fetchedSlides];
      if (_fetchedSlides.indexOf(action.payload.slideId) === -1) {
        _fetchedSlides.push(action.payload.slideId);
      }

      return {
        ...state,
        annotations,
        fetchedSlides: _fetchedSlides
      };

    case ActionTypes.RESET_SELECTION:
      return {
        ...state,
        selectedAnnotations: []
      };

    case ActionTypes.TOGGLE_SELECTED_ANNOTATION:
      return {
        ...state,
        selectedAnnotations: state.selectedAnnotations.filter(uuid => uuid !== action.payload)
      };

    case ActionTypes.SET_SELECTED:
      return {
        ...state,
        selectedAnnotations: [...state.selectedAnnotations, action.payload]
      };

    case ActionTypes.ADD_ANNOTATION:
      // Copy annotations
      const annsAdd = {...state.annotations};

      // Init annotations "bucket" for slide
      if (!annsAdd[action.payload.slideId]) {
        annsAdd[action.payload.slideId] = {};
      }

      // Add the annotation
      annsAdd[action.payload.slideId][action.payload.uuid] = action.payload;

      return {
        ...state,
        annotations: annsAdd
      };

    case ActionTypes.EDIT_ANNOTATION:
      const annsEdit = {...state.annotations};

      // Init annotations "bucket" for slide
      if (!annsEdit[action.payload.slideId]) {
        annsEdit[action.payload.slideId] = {};
      }

      // Overwrite the annotation
      annsEdit[action.payload.slideId][action.payload.uuid] = action.payload;

      return {
        ...state,
        annotations: annsEdit
      };

    case ActionTypes.DELETE_ANNOTATION:
      const annsDel = {...state.annotations};

      if (annsDel[action.payload.slideId]) {
        // Delete annotation
        delete annsDel[action.payload.slideId][action.payload.annotationId];
      }

      return {
        ...state,
        annotations: annsDel
      };

    case ActionTypes.CLEAR_ANNOTATIONS_WORKSPACE:
      return initialState;

    default:
      return state;
  }
}
