import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectorComponent } from './projector/projector.component';
import {FormsModule} from "@angular/forms";
import {SlideModule} from "../slide/slide.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SlideModule
  ],
  declarations: [ProjectorComponent]
})
export class LecturerModule { }
