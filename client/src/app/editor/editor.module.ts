import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnnotationSidebarComponent} from './annotation-sidebar/annotation-sidebar.component';
import {AnnotationToolbarComponent} from './annotation-toolbar/annotation-toolbar.component';
import {PdfEditorComponent} from './pdf-editor/pdf-editor.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    AnnotationSidebarComponent,
    AnnotationToolbarComponent,
    PdfEditorComponent
  ],
  exports: [PdfEditorComponent],
  providers: []
})
export class EditorModule {
}
