import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NoteComponent} from './note/note.component';
import {NoteWindowComponent} from './note-window/note-window.component';
import {MatIconRegistry} from '@angular/material/icon';
import {IconService} from './icon.service';
import {MaterialModule} from '../material/material.module';
import {AuthGuard} from './auth.guard';
import {QuillModule} from 'ngx-quill';
import {FormsModule} from '@angular/forms';
import {DraggableDirective} from './draggable.directive';
import {ResizableDirective} from './resizable.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    QuillModule
  ],
  declarations: [
    NoteComponent,
    NoteWindowComponent,
    DraggableDirective,
    ResizableDirective,
  ],
  exports: [
    NoteComponent,
    NoteWindowComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        MatIconRegistry,
        IconService,
        AuthGuard
      ]
    }
  }
}
