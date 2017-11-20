import {Action} from '@ngrx/store';
import {ToolDescription} from '../../service/model/tool-description';

import * as SVG from 'svg.js';

export enum ActionTypes {

  SET_ANNOTATION_CONTAINER = '[Editor] SET_ANNOTATION_CONTAINER',

  SET_TOOLS = '[Editor] SET_TOOLS',
  SELECT_TOOL = '[Editor] SELECT_TOOL',

  SET_COLOR = '[Editor] SET_COLOR',
  SET_STROKE = '[Editor] SET_STROKE'
};

export class SetAnnotationContainer implements Action {
  readonly type = ActionTypes.SET_ANNOTATION_CONTAINER;

  constructor(public payload: SVG.Doc) {}
}

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
  = SetAnnotationContainer
  | SetTools
  | SelectTool
  | SetColor
  | SetStroke;
