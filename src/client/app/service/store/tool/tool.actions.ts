import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Store, Action} from '@ngrx/store';
import {AppState} from '../../model/store/app-state';
import {Credentials} from '../../model/credentials';
import {ChangePasswordData} from '../../model/change-password';
import {ChangePasswordWithCodeData} from '../../model/change-password-with-code';
import {ErrorResponse, responseToError} from '../../model/error-response';

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
