import {UserState} from './user/user.state';
import {VideoState} from './video/video.state';
import {LectureState} from './lecture/lecture.state';
import {AnnotationState} from './annotation/annotation.state';
import {ToolState} from './tool/tool.state';

export interface AppState {

  readonly user: UserState;
  readonly video: VideoState;
  readonly lecture: LectureState;
  readonly annotation: AnnotationState;
  readonly tool: ToolState;
}
