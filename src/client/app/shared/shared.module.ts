import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NoteComponent} from './note/note.component';
import {MatIconRegistry} from '@angular/material/icon';
import {IconService} from './icon.service';
import {MaterialModule} from '../material/material.module';
import {AuthGuard} from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    NoteComponent
  ],
  exports: [
    NoteComponent
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
