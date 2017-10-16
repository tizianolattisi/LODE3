import {NgModule, ModuleWithProviders} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AnnotationService} from './annotation.service';
import {PencilTool} from './tools/pencil-tool';
import {AuthInterceptor} from './auth-interceptor';
import {SocketService} from './socket.service';
import {AuthService} from '../service/auth.service';
import {LectureService} from '../service/lecture.service';
import {VideoService} from '../service/video.service';
import {TOOLS} from './tools//tool-opaque-token';

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
        {
          provide: TOOLS,
          useClass: PencilTool,
          multi: true
        },
        SocketService,
        AuthService,
        LectureService,
        VideoService,
        AnnotationService
      ]
    }
  }
}
