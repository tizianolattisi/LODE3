import {AnnotationState} from './annotation.state';
import {ActionTypes, All} from './annotation.actions';


const initialState: AnnotationState = {
  annotations: {},
  selectedAnnotations: [],
  fetchedSlides: [],
  openNotes: []
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
      let openNotesDel = state.openNotes;

      if (annsDel[action.payload.slideId]) {
        const delAnn = annsDel[action.payload.slideId][action.payload.annotationId];

        if (delAnn && delAnn.type === 'note') { // Annotation is a note -> remove from open notes
          openNotesDel = removeOpenNote(openNotesDel, action.payload.slideId, action.payload.annotationId);
        }

        // Delete annotation
        delete annsDel[action.payload.slideId][action.payload.annotationId];
      }

      return {
        ...state,
        annotations: annsDel,
        openNotes: openNotesDel
      };

    case ActionTypes.CLEAR_ANNOTATIONS_WORKSPACE:
      return initialState;

    case ActionTypes.OPEN_NOTE:
      const openNotes1 = removeOpenNote(state.openNotes, action.payload.slideId, action.payload.annotationId);
      openNotes1.push(action.payload);
      return {
        ...state,
        openNotes: openNotes1
      };

    case ActionTypes.CLOSE_NOTE:
      const openNotes2 = removeOpenNote(state.openNotes, action.payload.slideId, action.payload.annotationId);

      return {
        ...state,
        openNotes: openNotes2
      };

    default:
      return state;
  }
}


function removeOpenNote(openNotes: any[], slideId: string, annotationId: string): any[] {
  return openNotes.filter(n => (n.slideId !== slideId || n.annotationId !== annotationId));
}
