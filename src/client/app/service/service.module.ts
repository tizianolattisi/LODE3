import {Store} from '@ngrx/store';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AnnotationService} from './annotation.service';
import {PencilTool} from './tools/pencil-tool';
import {NoteTool} from './tools/note-tool';
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
        {provide: TOOLS, useFactory: PencilTool.factory, deps: [Store], multi: true},
        {provide: TOOLS, useFactory: NoteTool.factory, deps: [Store], multi: true},
        SocketService,
        AuthService,
        LectureService,
        VideoService,
        AnnotationService
      ]
    }
  }
}
