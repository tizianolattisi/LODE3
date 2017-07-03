import {UserState} from './states/user.state';
import {VideoState} from './states/video.state';
import {LectureState} from './states/lecture.state';
import {AnnotationState} from './states/annotation.state';
import {ToolState} from './states/tool.state';

export interface AppState {

  readonly user: UserState;
  readonly video: VideoState;
  readonly lecture: LectureState;
  readonly annotation: AnnotationState;
  readonly tool: ToolState;
}
