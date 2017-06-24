import {Action} from '@ngrx/store';
import {ToolDescription} from '../../service/model/tool-description';


export enum ActionTypes {

  SET_TOOLS = '[Editor] SET_TOOLS',
  SELECT_TOOL = '[Editor] SELECT_TOOL',

  SET_COLOR = '[Editor] SET_COLOR',
  SET_STROKE = '[Editor] SET_STROKE'
};

export class SetTools implements Action {
  readonly type = ActionTypes.SET_TOOLS;

  constructor(public payload: ToolDescription[]) {}
}

export class SelectTool implements Action {
  readonly type = ActionTypes.SELECT_TOOL;

  constructor(public payload: string) {}
}

export class SetColor implements Action {
  readonly type = ActionTypes.SET_COLOR;

  constructor(public payload: string) {}
}

export class SetStroke implements Action {
  readonly type = ActionTypes.SET_STROKE;

  constructor(public payload: number) {}
}


export type All
  = SetTools
  | SelectTool
  | SetColor
  | SetStroke;
