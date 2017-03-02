import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SlideNoteBarComponent, SlideDirective} from './slide-note-bar/slide-note-bar.component';
import { SlideViewerComponent } from './slide-viewer/slide-viewer.component';
import { VideoLectureComponent } from './video-lecture/video-lecture.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [SlideNoteBarComponent, SlideViewerComponent, VideoLectureComponent, SlideDirective],
  exports: [VideoLectureComponent]
})
export class VideoModule { }
