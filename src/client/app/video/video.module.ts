import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { videoRoutes } from './video.routing';
import { ViewerComponent } from './viewer/viewer.component';
import { LectureViewerComponent } from './lecture-viewer/lecture-viewer.component';
import { VideoBoxComponent } from './video-box/video-box.component';
import { NoteBoxComponent } from './note-box/note-box.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ControlsComponent } from './controls/controls.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(videoRoutes)
  ],
  declarations: [ViewerComponent, LectureViewerComponent, VideoBoxComponent, NoteBoxComponent, TimelineComponent, ControlsComponent]
})
export class VideoModule { }
