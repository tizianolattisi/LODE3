import { Action } from '@ngrx/store';

export const SET_CAM_VIDEO_URL = '[Video] SET_CAM_VIDEO_URL';
export const SET_PC_VIDEO_URL = '[Video] SET_PC_VIDEO_URL';
export const PLAY = '[Video] PLAY';
export const PAUSE = '[Video] PAUSE';
export const SET_CURRENT_TIME = '[Video] SET_CURRENT_TIME';
export const SET_UPDATED_TIME = '[Video] SET_UPDATED_TIME';
export const SET_TOTAL_TIME = '[Video] SET_TOTAL_TIME';
export const SET_SPEED = '[Video] SET_SPEED';
export const MUTE_AUDIO = '[Video] MUTE_AUDIO';
export const UNMUTE_AUDIO = '[Video] UNMUTE_AUDIO';

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

export class SetCurrentTime implements Action {
  readonly type = SET_CURRENT_TIME;

  constructor(public payload: number) { }
}

export class SetTotalTime implements Action {
  readonly type = SET_TOTAL_TIME;

  constructor(public payload: number) { }
}

export class SetUpdatedTime implements Action {
  readonly type = SET_UPDATED_TIME;

  constructor(public payload: number) { }
}

export class SetSpeed implements Action {
  readonly type = SET_SPEED;

  constructor(public payload: number) { }
}

export class MuteAudio implements Action {
  readonly type = MUTE_AUDIO;
}

export class UnmuteAudio implements Action {
  readonly type = UNMUTE_AUDIO;
}

export type All
  = SetCamVideoUrl
  | SetPcVideoUrl
  | Play
  | Pause
  | SetCurrentTime
  | SetUpdatedTime
  | SetTotalTime
  | MuteAudio
  | UnmuteAudio
  | SetSpeed;
