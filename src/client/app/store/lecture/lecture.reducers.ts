import {ActionTypes} from './lecture.actions';
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
  snapshotStatus: 'done'
}

export function lectureReducer(state: LectureState = initialState, action: Action): LectureState {

  switch (action.type) {

    // Lecture list //////////////////////////////////////////////////////

    case ActionTypes.UPDATE_LECTURE_LIST:
      return state;

    case ActionTypes.SET_LECTURE_LIST:
      return {
        ...state,
        lectures: action.payload.lectures,
        liveLectures: action.payload.live
      };

    case ActionTypes.UPDATE_LECTURE_LIST_ERROR:
      return {
        ...state,
        lecturesLoadError: action.payload
      };


    // Specific lecture info ////////////////////////////////////////////

    case ActionTypes.FETCH_LECTURE_ERROR:
      return {
        ...state,
        currentLecture: null,
        currentLectureFetchError: action.payload
      };

    case ActionTypes.SET_CURRENT_LECTURE:
      return {
        ...state,
        currentLecture: action.payload,
        currentLectureFetchError: null,

        // Reset current lecture data
        slides: [],
        slidesError: null,
        currentSlideIndex: -1,
        snapshotStatus: 'done'
      };

    case ActionTypes.SET_CURRENT_PIN:
      return {
        ...state,
        currentPin: action.payload
      };

    // User screenshots ///////////////////////////////////////////////

    case ActionTypes.FETCH_USER_SCREENSHOTS_ERROR:
      return {
        ...state,
        slidesError: action.payload
      };

    case ActionTypes.SET_USER_SCREENSHOTS:
      return {
        ...state,
        slides: action.payload
      };

    case ActionTypes.SET_USER_SCREENSHOTS_IMG:
      return {
        ...state,
        slides: action.payload,
        currentSlideIndex: 0
      };

    case ActionTypes.SET_SLIDES:
      return {
        ...state,
        slides: action.payload
      };

    case ActionTypes.SET_CURRENT_SLIDE:
      return {
        ...state,
        currentSlideIndex: action.payload
      };

    case ActionTypes.PREV_SLIDE:
      return {
        ...state,
        currentSlideIndex: state.currentSlideIndex > 0 ? state.currentSlideIndex - 1 : state.currentSlideIndex
      };

    case ActionTypes.NEXT_SLIDE:
      return {
        ...state,
        currentSlideIndex: (state.currentSlideIndex < state.slides.length - 1) ? state.currentSlideIndex + 1 : state.currentSlideIndex
      };

    case ActionTypes.GET_SCREENSHOT:
      return {
        ...state,
        snapshotStatus: 'pending'
      };

    case ActionTypes.GET_SCREENSHOT_COMPLETE:
      const getScreenshotSlides = [...state.slides, action.payload];
      return {
        ...state,
        slides: getScreenshotSlides,
        currentSlideIndex: getScreenshotSlides.length - 1,
        snapshotStatus: 'done'
      };

    case ActionTypes.GET_SCREENSHOT_ERROR:
      return {...state, snapshotStatus: 'done'};

    case ActionTypes.SET_SCREENSHOT_STATUS:
      return {
        ...state,
        snapshotStatus: action.payload
      };

    default:
      return state;
  }
}

