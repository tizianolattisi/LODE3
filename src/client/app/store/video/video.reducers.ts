import * as VideoActions from './video.actions';
import { VideoState } from './video.state';

export type Action = VideoActions.All;


const initialState: VideoState = {
  camUrl: '',
  pcUrl: '',
  playing: false,
  time: 0,
  speed: 1
}

export function videoReducer(state: VideoState = initialState, action: Action): VideoState {

  switch (action.type) {

    case VideoActions.SET_CAM_VIDEO_URL:
      return {
        ...state,
        camUrl: action.payload
      };

    case VideoActions.SET_PC_VIDEO_URL:
      return {
        ...state,
        pcUrl: action.payload
      };

    case VideoActions.PLAY:
      return {
        ...state,
        playing: true
      };

    case VideoActions.PAUSE:
      return {
        ...state,
        playing: false
      };

    case VideoActions.UPDATE_TIME:
      return {
        ...state,
        time: action.payload
      };

    case VideoActions.SET_TIME:
      return {
        ...state,
        time: action.payload
      };

    case VideoActions.SET_SPEED:
      return {
        ...state,
        speed: action.payload
      };

    default:
      return state;
  }
}

