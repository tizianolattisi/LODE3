import {Action} from '@ngrx/store';

export const SET_TOOLS = '[Tool] SET_TOOLS';
export const SELECT_TOOL = '[Tool] SELECT_TOOL';

export class SetTools implements Action {
  readonly type = SET_TOOLS;

  constructor(public payload: any) {} // TODO type
}

export class SelectTool implements Action {
  readonly type = SELECT_TOOL;

  constructor(public payload: string) {} // TODO type
}

export type All
  = SetTools
  | SelectTool;
