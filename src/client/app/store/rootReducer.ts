import {userReducer} from '../store/user/user.reducers';
import {videoReducer} from '../store/video/video.reducers';
import {lectureReducer} from './lecture/lecture.reducers';
import {annotationReducer} from './annotation/annotation.reducers';
import {editorReducer} from './editor/editor.reducers';

export const rootReducer = {
  user: userReducer,
  video: videoReducer,
  lecture: lectureReducer,
  annotation: annotationReducer,
  editor: editorReducer,
};
