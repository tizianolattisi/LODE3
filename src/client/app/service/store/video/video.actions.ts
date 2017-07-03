import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Store, Action} from '@ngrx/store';
import {AppState} from '../../model/store/app-state';
import {Credentials} from '../../model/credentials';
import {ChangePasswordData} from '../../model/change-password';
import {ChangePasswordWithCodeData} from '../../model/change-password-with-code';
import {ErrorResponse, responseToError} from '../../model/error-response';

export const SET_VIDEO_URL = '[Video] SET_VIDEO_URL';
export const PLAY = '[Video] PLAY';
export const PAUSE = '[Video] PAUSE';
export const UPDATE_TIME = '[Video] UPDATE_TIME';
export const SET_TIME = '[Video] SET_TIME';
export const SET_SPEED = '[Video] SET_SPEED';

export class SetVideoUrl implements Action {
  readonly type = SET_VIDEO_URL;

  constructor(public payload: string) {}
}

export class Play implements Action {
  readonly type = PLAY;
}

export class Pause implements Action {
  readonly type = PAUSE;
}

export class UpdateTime implements Action {
  readonly type = UPDATE_TIME;

  constructor(public payload: number) {}
}

export class SetTime implements Action {
  readonly type = SET_TIME;

  constructor(public payload: number) {}
}

export class SetSpeed implements Action {
  readonly type = SET_SPEED;

  constructor(public payload: number) {}
}

export type All
  = SetVideoUrl
  | Play
  | Pause
  | UpdateTime
  | SetTime
  | SetSpeed;
