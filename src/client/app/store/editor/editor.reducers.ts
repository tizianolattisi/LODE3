import {EditorState} from './editor.state';
import {ActionTypes, All} from './editor.actions';


const initialState: EditorState = {

  annotationContainer: null,

  tools: [],
  selectedTool: 'default',

  color: '#212121',
  stroke: 2
}

export function editorReducer(state: EditorState = initialState, action: All): EditorState {

  switch (action.type) {

    case ActionTypes.SET_ANNOTATION_CONTAINER:
      return {
        ...state,
        annotationContainer: action.payload
      };

    case ActionTypes.SET_TOOLS:
      return {
        ...state,
        tools: action.payload
      };

    case ActionTypes.SELECT_TOOL:
      return {
        ...state,
        selectedTool: action.payload
      };

    case ActionTypes.SET_COLOR:
      return {
        ...state,
        color: action.payload
      };

    case ActionTypes.SET_STROKE:
      return {
        ...state,
        stroke: action.payload
      };

    default:
      return state;
  }
}
