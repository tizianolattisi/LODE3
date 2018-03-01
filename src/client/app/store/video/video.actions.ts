import { Action } from '@ngrx/store';

export const SET_CAM_VIDEO_URL = '[Video] SET_CAM_VIDEO_URL';
export const SET_PC_VIDEO_URL = '[Video] SET_PC_VIDEO_URL';
export const PLAY = '[Video] PLAY';
export const PAUSE = '[Video] PAUSE';
export const UPDATE_TIME = '[Video] UPDATE_TIME';
export const SET_TIME = '[Video] SET_TIME';
export const SET_SPEED = '[Video] SET_SPEED';

export class SetCamVideoUrl implements Action {
  readonly type = SET_CAM_VIDEO_URL;

  constructor(public payload: string) { }
}

export class SetPcVideoUrl implements Action {
  readonly type = SET_PC_VIDEO_URL;

  constructor(public payload: string) { }
}

export class Play implements Action {
  readonly type = PLAY;
}

export class Pause implements Action {
  readonly type = PAUSE;
}

export class UpdateTime implements Action {
  readonly type = UPDATE_TIME;

  constructor(public payload: number) { }
}

export class SetTime implements Action {
  readonly type = SET_TIME;

  constructor(public payload: number) { }
}

export class SetSpeed implements Action {
  readonly type = SET_SPEED;

  constructor(public payload: number) { }
}

export type All
  = SetCamVideoUrl
  | SetPcVideoUrl
  | Play
  | Pause
  | UpdateTime
  | SetTime
  | SetSpeed;
