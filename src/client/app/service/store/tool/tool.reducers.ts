import {ToolState} from '../../model/store/states/tool.state';
import * as ToolActions from './tool.actions';

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

