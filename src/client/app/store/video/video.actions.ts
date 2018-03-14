import { Action } from '@ngrx/store';
import { Layout } from './video.state'

export const SET_CAM_VIDEO_URL = '[Video] SET_CAM_VIDEO_URL';
export const SET_PC_VIDEO_URL = '[Video] SET_PC_VIDEO_URL';

export const PLAY = '[Video] PLAY';
export const PAUSE = '[Video] PAUSE';
export const SET_TOTAL_TIME = '[Video] SET_TOTAL_TIME';
export const SET_CURRENT_TIME = '[Video] SET_CURRENT_TIME';
export const SET_UPDATED_TIME = '[Video] SET_UPDATED_TIME';
export const SET_SPEED = '[Video] SET_SPEED';
export const MUTE_AUDIO = '[Video] MUTE_AUDIO';
export const UNMUTE_AUDIO = '[Video] UNMUTE_AUDIO';
export const SET_VIDEO_LAYOUT = '[Video] SET_VIDEO_LAYOUT';

export const SET_START_TIMESTAMP = '[Video] SET_START_TIME'
export const SET_HAS_ANNOTATIONS = '[Video] SET_HAS_ANNOTATIONS'

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

export class SetTotalTime implements Action {
  readonly type = SET_TOTAL_TIME;

  constructor(public payload: number) { }
}

export class SetUpdatedTime implements Action {
  readonly type = SET_UPDATED_TIME;

  constructor(public payload: number) { }
}

export class SetCurrentTime implements Action {
  readonly type = SET_CURRENT_TIME;

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

export class SetVideoLayout implements Action {
  readonly type = SET_VIDEO_LAYOUT;

  constructor(public payload: Layout) { }
}

export class SetStartTimestamp implements Action {
  readonly type = SET_START_TIMESTAMP;

  constructor(public payload: number) { }
}

export class SetHasAnnotations implements Action {
  readonly type = SET_HAS_ANNOTATIONS;

  constructor(public payload: boolean) { }
}
export type All
  = SetCamVideoUrl
  | SetPcVideoUrl
  | Play
  | Pause
  | SetTotalTime
  | SetCurrentTime
  | SetUpdatedTime
  | MuteAudio
  | UnmuteAudio
  | SetVideoLayout
  | SetSpeed
  | SetStartTimestamp
  | SetHasAnnotations;
