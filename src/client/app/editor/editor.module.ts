import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ServiceModule} from '../service/service.module';
import {editorRoutes} from './editor.routing';
import {LectureEditorComponent} from './lecture-editor/lecture-editor.component';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(editorRoutes),
    ServiceModule,
    MaterialModule
  ],
  declarations: [
    LectureEditorComponent
  ]
})
export class EditorModule {}
