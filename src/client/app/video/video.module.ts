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
import { LinearPlayerComponent } from './linear-player/linear-player.component';
import { SecondsToTimePipe } from './seconds-to-time.pipe';
import { TabularPlayerComponent } from './tabular-player/tabular-player.component'
import { SharedModule } from '../shared/shared.module';
import { NoteReaderComponent } from './note-reader/note-reader.component';
import { TrackerService } from '../service/tracker.service'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(videoRoutes),
    MaterialModule,
    SharedModule
  ],
  providers: [
    TrackerService
  ],
  declarations: [
    LectureViewerComponent,
    VideoBoxComponent,
    NoteBoxComponent,
    TimelineComponent,
    ControlsComponent,
    NoteSliderComponent,
    LinearPlayerComponent,
    SecondsToTimePipe,
    TabularPlayerComponent,
    NoteReaderComponent]
})
export class VideoModule { }
