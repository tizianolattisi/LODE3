import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RequestOptions, XHRBackend} from '@angular/http';
import {Router} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {Store, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {AnnotationService} from '../service/annotation.service';
import {AnnotationStorageService} from '../service/annotation-storage.service';
import {AuthService} from '../service/auth.service';
import {LectureService} from '../service/lecture.service';
import {ToolService} from '../service/tool.service';
import {VideoService} from '../service/video.service';
import {HttpAuth} from './http-auth.service';
import {AppState} from './model/store/app-state';
import {rootReducer} from './store/rootReducer';
import {environment} from '../../environments/environment';
import {AnnotationEffects} from './store/annotation/annotation.effects';
import {ToolEffects} from './store/tool/tool.effects';
import {UserEffects} from './store/user/user.effects';
import {VideoEffects} from './store/video/video.effects';
import {LectureEffects} from './store/lecture/lecture.effects';

@NgModule({
  imports: [
    StoreModule.forRoot(rootReducer),
    EffectsModule.forRoot([UserEffects, LectureEffects, VideoEffects, AnnotationEffects, ToolEffects]),
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : []
  ]
})
export class ServiceModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        {
          provide: HttpAuth,
          useFactory: httpAuthFactory,
          deps: [XHRBackend, RequestOptions, Store, Router]
        },
        AnnotationService,
        AnnotationStorageService,
        AuthService,
        LectureService,
        ToolService,
        VideoService
      ]
    }
  }
}

export function httpAuthFactory(backend: XHRBackend, options: RequestOptions, store: Store<AppState>, router: Router): HttpAuth {
  return new HttpAuth(backend, options, store, router);
}
