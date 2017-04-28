import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app/app.component';
import {HomePageComponent} from './home-page/home-page.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {WebSocketStorage} from "../annotation/storage/WebSocketStorage";
import {STORAGE_OPAQUE_TOKEN} from "../annotation/utils/Utils";
import {StoreService} from "../shared/store.service";
import {CodeParamGuard} from "./code-param-guard";
import {AuthGuard} from "./auth-guard";
import {AnnotationManager} from "../annotation/AnnotationManager";
import {appRoutes} from "./app.routing";
import {UserModule} from "../user/user.module";
import {EditorModule} from "../editor/editor.module";
import {VideoModule} from "../video/video.module";
import {UserService} from "../user/user.service";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {ToolService} from "../annotation/tool.service";
import {LecturerModule} from "../lecturer/lecturer.module";
import { TestPageComponent } from './test-page/test-page.component';
import {IconLoader} from "./icon-loader.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    UserModule,
    EditorModule,
    VideoModule,
    LecturerModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    HomePageComponent,
    PageNotFoundComponent,
    TestPageComponent
  ],
  providers: [
    UserService,
    StoreService,
    {provide: STORAGE_OPAQUE_TOKEN, useClass: WebSocketStorage},
    AnnotationManager,
    ToolService,
    AuthGuard,
    CodeParamGuard,
    IconLoader
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
