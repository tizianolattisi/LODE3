import {Action} from '@ngrx/store';
import {ToolDescription} from '../../service/model/tool-description';

export const SET_TOOLS = '[Tool] SET_TOOLS';
export const SELECT_TOOL = '[Tool] SELECT_TOOL';

export class SetTools implements Action {
  readonly type = SET_TOOLS;

  constructor(public payload: ToolDescription[]) {}
}

export class SelectTool implements Action {
  readonly type = SELECT_TOOL;

  constructor(public payload: string) {}
}

export type All
  = SetTools
  | SelectTool;
