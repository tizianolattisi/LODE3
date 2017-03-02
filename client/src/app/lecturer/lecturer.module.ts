import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectorComponent } from './projector/projector.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ProjectorComponent]
})
export class LecturerModule { }
