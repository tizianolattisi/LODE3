import {AuthInterceptor} from './auth-interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {AnnotationService} from '../service/annotation.service';
import {AnnotationStorageService} from '../service/annotation-storage.service';
import {AuthService} from '../service/auth.service';
import {LectureService} from '../service/lecture.service';
import {ToolService} from '../service/tool.service';
import {VideoService} from '../service/video.service';

@NgModule()
export class ServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
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
