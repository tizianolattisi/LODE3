import * as ToolActions from './tool.actions';
import {ToolState} from './tool.state';

export type Action = ToolActions.All;


const initialState: ToolState = {
  tools: [],
  selectedTool: 'default',
}

export function toolReducer(state: ToolState = initialState, action: Action): ToolState {

  switch (action.type) {

    case ToolActions.SET_TOOLS:
      return {
        ...state,
        tools: action.payload
      };

    case ToolActions.SELECT_TOOL:
      return {
        ...state,
        selectedTool: action.payload
      };

    default:
      return state;
  }
}

