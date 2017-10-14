import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ServiceModule} from '../service/service.module';
import {editorRoutes} from './editor.routing';
import {LectureEditorComponent} from './lecture-editor/lecture-editor.component';
import {MaterialModule} from '../material/material.module';
import { LateralBarSlidesComponent } from './lateral-bar-slides/lateral-bar-slides.component';
import { LateralBarAnnotationsComponent } from './lateral-bar-annotations/lateral-bar-annotations.component';
import { LateralBarDownloadComponent } from './lateral-bar-download/lateral-bar-download.component';
import { LateralBarVideoComponent } from './lateral-bar-video/lateral-bar-video.component';
import { ToolsBarComponent } from './tools-bar/tools-bar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(editorRoutes),
    ServiceModule,
    MaterialModule
  ],
  declarations: [
    LectureEditorComponent,
    LateralBarSlidesComponent,
    LateralBarAnnotationsComponent,
    LateralBarDownloadComponent,
    LateralBarVideoComponent,
    ToolsBarComponent
  ]
})
export class EditorModule {}
