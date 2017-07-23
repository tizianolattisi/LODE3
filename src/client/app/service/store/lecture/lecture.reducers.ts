import {LectureState} from '../../model/store/states/lecture.state';
import * as LectureActions from './lecture.actions';

export type Action = LectureActions.All;


const initialState: LectureState = {
  lectures: [],
  liveLectures: [],
  lecturesLoadError: null,

  lectureId: '',
  slides: [],
  currentSlideIndex: -1,
  snapshotStatus: '' // TODO set proper value,
}

export function lectureReducer(state: LectureState = initialState, action: Action): LectureState {

  switch (action.type) {

    case LectureActions.UPDATE_LECTURE_LIST:
      return state;

    case LectureActions.SET_LECTURE_LIST:
      return {
        ...state,
        lectures: action.payload.lectures,
        liveLectures: action.payload.live
      };

    case LectureActions.UPDATE_LECTURE_LIST_ERROR:
      return {
        ...state,
        lecturesLoadError: action.payload
      };

    case LectureActions.ADD_SLIDES:
      return {
        ...state,
        slides: [...state.slides, ...action.payload]
      };

    case LectureActions.ADD_SNAPSHOT:
      return {
        ...state,
        slides: [...state.slides, action.payload]
      };

    case LectureActions.SET_SLIDES:
      return {
        ...state,
        slides: action.payload
      };

    case LectureActions.SET_CURRENT_SLIDE:
      return {
        ...state,
        currentSlideIndex: action.payload
      };

    case LectureActions.PREV_SLIDE:
      return {
        ...state,
        currentSlideIndex: state.currentSlideIndex > 0 ? state.currentSlideIndex - 1 : state.currentSlideIndex
      };

    case LectureActions.NEXT_SLIDE:
      return {
        ...state,
        currentSlideIndex: (state.currentSlideIndex < state.slides.length - 1) ? state.currentSlideIndex + 1 : state.currentSlideIndex
      };

    case LectureActions.GET_SNAPSHOT:
      return {
        ...state,
        snapshotStatus: 'pending' // TODO set proper value
      };

    case LectureActions.SET_SNAPSHOT_STATUS:
      return {
        ...state,
        snapshotStatus: action.payload
      };

    default:
      return state;
  }
}

