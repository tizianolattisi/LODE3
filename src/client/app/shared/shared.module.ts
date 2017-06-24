import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceModule} from '../service/service.module';
import {NoteComponent} from './note/note.component';
import {MdIconRegistry} from '@angular/material';
import {IconService} from './icon.service';
import {MaterialModule} from '../material/material.module';
import {AuthGuard} from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ServiceModule.forRoot()
  ],
  declarations: [
    NoteComponent
  ],
  providers: [
    MdIconRegistry
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
        IconService,
        AuthGuard
      ]
    }
  }
}
