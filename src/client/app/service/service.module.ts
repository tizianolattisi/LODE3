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
import {UserAction} from './store/user/user.actions';
import {UserEffects} from './store/user/user.effects';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    EffectsModule.run(UserEffects),
    !environment.production ? StoreDevtoolsModule.instrumentOnlyWithExtension({maxAge: 50}) : []
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
          deps: [XHRBackend, RequestOptions, Store, UserAction, Router]
        },
        AnnotationService,
        AnnotationStorageService,
        AuthService,
        LectureService,
        ToolService,
        VideoService,

        UserAction
      ]
    }
  }
}

export function httpAuthFactory(backend: XHRBackend, options: RequestOptions,
  store: Store<AppState>, userActions: UserAction, router: Router): HttpAuth {
  return new HttpAuth(backend, options, store, userActions, router);
}
