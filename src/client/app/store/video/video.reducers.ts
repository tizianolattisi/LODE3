import * as VideoActions from './video.actions';
import { VideoState, Layout } from './video.state';
import { Annotation, DataType } from '../../service/model/annotation';

export type Action = VideoActions.All;


const initialState: VideoState = {
  camUrl: '',
  pcUrl: '',

  playing: false,
  totalTime: 0,
  currentTime: 0,
  updatedTime: 0,
  speed: 1,
  volume: true,
  videoLayout: Layout.NONE,
  hasAnnotations: false,
  startTimestamp: 0,
  allAnnotations: new Map<string, Annotation<DataType>[]>()
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

    case VideoActions.SET_VIDEO_LAYOUT:
      return {
        ...state,
        videoLayout: action.payload
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

    case VideoActions.SET_TOTAL_TIME:
      return {
        ...state,
        totalTime: action.payload
      };

    case VideoActions.SET_UPDATED_TIME:
      return {
        ...state,
        updatedTime: action.payload
      };

    case VideoActions.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload
      };

    case VideoActions.SET_SPEED:
      return {
        ...state,
        speed: action.payload
      };

    case VideoActions.MUTE_AUDIO:
      return {
        ...state,
        volume: false
      };

    case VideoActions.UNMUTE_AUDIO:
      return {
        ...state,
        volume: true
      };

    case VideoActions.SET_HAS_ANNOTATIONS:
      return {
        ...state,
        hasAnnotations: action.payload
      };

    case VideoActions.SET_START_TIMESTAMP:
      return {
        ...state,
        startTimestamp: action.payload
      };

    case VideoActions.SET_COMPLETE_ANNOTATIONS:
      return {
        ...state,
        allAnnotations: action.payload
      };
    default:
      return state;
  }
}

