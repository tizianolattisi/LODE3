import {userReducer} from '../store/user/user.reducers';
import {videoReducer} from '../store/video/video.reducers';
import {lectureReducer} from './lecture/lecture.reducers';
import {annotationReducer} from './annotation/annotation.reducers';
import {toolReducer} from './tool/tool.reducers';

export const rootReducer = {
  user: userReducer,
  video: videoReducer,
  lecture: lectureReducer,
  annotation: annotationReducer,
  tool: toolReducer,
};
