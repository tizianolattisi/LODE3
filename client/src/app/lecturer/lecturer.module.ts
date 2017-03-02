import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectorComponent } from './projector/projector.component';
import {FormsModule} from "@angular/forms";
import { SlideViewerComponent } from './slide-viewer/slide-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ProjectorComponent, SlideViewerComponent]
})
export class LecturerModule { }
