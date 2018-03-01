import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { SetCamVideoUrl, SetPcVideoUrl, SetTime } from '../../store/video/video.actions'
@Component({
  selector: 'l3-lecture-viewer',
  templateUrl: './lecture-viewer.component.html',
  styleUrls: ['./lecture-viewer.component.scss']
})
export class LectureViewerComponent implements OnInit {

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit() {
    // aggiorno i parametri dello store
    this.store.dispatch(new SetCamVideoUrl('http://127.0.0.1:8887/rtsp.mp4'));
    this.store.dispatch(new SetPcVideoUrl('http://127.0.0.1:8887/pvr.mp4'));
    this.store.dispatch(new SetTime(991))

  }
}
