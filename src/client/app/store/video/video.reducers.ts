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
  showSlides: false,
  hiddenHeader: false,
  allAnnotations: new Map<string, Annotation<DataType>[]>()
}

export function videoReducer(state: VideoState = initialState, action: Action): VideoState {

  switch (action.type) {

    case VideoActions.SET_VIDEO_DATA:
      return {
        ...state,
        updatedTime: 0,
        camUrl: action.payload.data.camvideo === undefined ? '' : action.payload.data.camvideo[0].name,
        pcUrl: action.payload.data.pcvideo[0].name,
        hasAnnotations: action.payload.data.info[0].annotations.toString() === 'true',
        videoLayout: action.payload.data.info[0].annotations.toString() === 'true' ? (action.payload.data.camvideo !== undefined ? Layout.TABULAR3 : Layout.TABULAR2) : (action.payload.data.camvideo !== undefined ? Layout.TABULAR2 : Layout.NONE),
        totalTime: parseInt(action.payload.data.pcvideo[0].totaltime),
        startTimestamp: parseInt(action.payload.data.info[0].startDate)
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

    case VideoActions.SET_COMPLETE_ANNOTATIONS:
      return {
        ...state,
        allAnnotations: action.payload
      };

    case VideoActions.SET_VIDEO_LAYOUT:
      return {
        ...state,
        videoLayout: action.payload
      };

    case VideoActions.SHOW_SLIDES:
      return {
        ...state,
        showSlides: action.payload
      }

    case VideoActions.HIDE_HEADER:
      return {
        ...state,
        hiddenHeader: action.payload
      }

    case VideoActions.RESET_DATA:
      return {
        ...state,
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
        showSlides: false,
        hiddenHeader: false,
        allAnnotations: new Map<string, Annotation<DataType>[]>()
      }

    default:
      return state;
  }
}

