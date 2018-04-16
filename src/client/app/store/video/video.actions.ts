import { Action } from '@ngrx/store';
import { Layout } from './video.state'
import { Annotation, DataType } from '../../service/model/annotation';

export const SET_VIDEO_DATA = '[VIDEO] SET_VIDEO_DATA'

export const PLAY = '[Video] PLAY';
export const PAUSE = '[Video] PAUSE';

export const SET_CURRENT_TIME = '[Video] SET_CURRENT_TIME';
export const SET_UPDATED_TIME = '[Video] SET_UPDATED_TIME';
export const SET_SPEED = '[Video] SET_SPEED';
export const MUTE_AUDIO = '[Video] MUTE_AUDIO';
export const UNMUTE_AUDIO = '[Video] UNMUTE_AUDIO';
export const SET_COMPLETE_ANNOTATIONS = '[Video] SET_COMPLETE_ANNOTATIONS'
export const SET_VIDEO_LAYOUT = '[Video] SET_VIDEO_LAYOUT'
export const SHOW_SLIDES = '[Video] SHOW_SLIDES'
export const HIDE_HEADER = '[Video] HIDE_HEADER'

export class SetVideoData implements Action {
  readonly type = SET_VIDEO_DATA;

  constructor(public payload: any) { }
}

export class Play implements Action {
  readonly type = PLAY;
}

export class Pause implements Action {
  readonly type = PAUSE;
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

export class ShowSlides implements Action {
  readonly type = SHOW_SLIDES;

  constructor(public payload: boolean) { }
}

export class HideHeader implements Action {
  readonly type = HIDE_HEADER;

  constructor(public payload: boolean) { }
}

export class SetCompleteAnnotations implements Action {
  readonly type = SET_COMPLETE_ANNOTATIONS;

  constructor(public payload: Map<string, Annotation<DataType>[]>) { }
}
export type All
  = SetVideoData
  | Play
  | Pause
  | SetCurrentTime
  | SetUpdatedTime
  | MuteAudio
  | UnmuteAudio
  | SetSpeed
  | SetVideoLayout
  | SetCompleteAnnotations
  | ShowSlides
  | HideHeader;
