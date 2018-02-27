import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { videoRoutes } from './video.routing';
import { LectureViewerComponent } from './lecture-viewer/lecture-viewer.component';
import { VideoBoxComponent } from './video-box/video-box.component';
import { NoteBoxComponent } from './note-box/note-box.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ControlsComponent } from './controls/controls.component';
import { MaterialModule } from '../material/material.module';
import { NoteSliderComponent } from './note-slider/note-slider.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(videoRoutes),
    MaterialModule
  ],
  declarations: [LectureViewerComponent, VideoBoxComponent, NoteBoxComponent, TimelineComponent, ControlsComponent, NoteSliderComponent]
})
export class VideoModule { }
