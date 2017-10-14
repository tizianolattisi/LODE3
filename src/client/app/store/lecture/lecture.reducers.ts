import * as LectureActions from './lecture.actions';
import {LectureState} from './lecture.state';

export type Action = LectureActions.All;


const initialState: LectureState = {
  lectures: [],
  liveLectures: [],
  lecturesLoadError: null,

  currentLecture: null,
  currentLectureFetchError: null,
  currentPin: '',

  slides: [],
  slidesError: null,
  currentSlideIndex: -1,
  snapshotStatus: '' // TODO set proper value,
}

export function lectureReducer(state: LectureState = initialState, action: Action): LectureState {

  switch (action.type) {

    // Lecture list //////////////////////////////////////////////////////

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


    // Specific lecture info ////////////////////////////////////////////

    case LectureActions.FETCH_LECTURE_ERROR:
      return {
        ...state,
        currentLecture: null,
        currentLectureFetchError: action.payload
      };

    case LectureActions.SET_CURRENT_LECTURE:
      return {
        ...state,
        currentLecture: action.payload,
        currentLectureFetchError: null
      };

    case LectureActions.SET_CURRENT_PIN:
      return {
        ...state,
        currentPin: action.payload
      };

    // User screenshots ///////////////////////////////////////////////

    case LectureActions.FETCH_USER_SCREENSHOTS_ERROR:
      return {
        ...state,
        slidesError: action.payload
      };

    case LectureActions.SET_USER_SCREENSHOTS:
      return {
        ...state,
        slides: action.payload
      };

    case LectureActions.SET_USER_SCREENSHOTS_IMG:
      return {
        ...state,
        slides: action.payload
      };


    // case LectureActions.ADD_SLIDES:
    //   return {
    //     ...state,
    //     slides: [...state.slides, ...action.payload]
    //   };

    // case LectureActions.ADD_SNAPSHOT:
    //   return {
    //     ...state,
    //     slides: [...state.slides, action.payload]
    //   };

    // case LectureActions.SET_SLIDES:
    //   return {
    //     ...state,
    //     slides: action.payload
    //   };

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

