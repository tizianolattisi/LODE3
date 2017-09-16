import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule as NgrxStoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../../environments/environment';
import {rootReducer} from './rootReducer';
import {UserEffects} from './user/user.effects';
import {LectureEffects} from './lecture/lecture.effects';
import {VideoEffects} from './video/video.effects';
import {AnnotationEffects} from './annotation/annotation.effects';
import {ToolEffects} from './tool/tool.effects';

@NgModule({
  imports: [
    NgrxStoreModule.forRoot(rootReducer),
    EffectsModule.forRoot([
      UserEffects,
      LectureEffects,
      VideoEffects,
      AnnotationEffects,
      ToolEffects
    ]),
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : []
  ]
})
export class StoreModule {}
