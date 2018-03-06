import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { SetCamVideoUrl, SetPcVideoUrl, SetTotalTime } from '../../store/video/video.actions'
import { ActivatedRoute } from '@angular/router';
import * as LectureActions from '../../store/lecture/lecture.actions'
import * as VideoActions from '../../store/video/video.actions'
import { Subscription } from 'rxjs/Subscription';
import { Lecture } from '../../service/model/lecture';

@Component({
  selector: 'l3-lecture-viewer',
  templateUrl: './lecture-viewer.component.html',
  styleUrls: ['./lecture-viewer.component.scss']
})
export class LectureViewerComponent implements OnInit {

  private lectureSubscr: Subscription;
  private camVideo: HTMLVideoElement;
  lecture: Lecture;

  constructor(
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    this.lectureSubscr = this.store.select(s => s.lecture.currentLecture)
      .subscribe(lecture => {
        this.lecture = lecture;
        if (lecture) {
          this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid))
        } else {
          this.route.params.first().subscribe(params => this.store.dispatch(new LectureActions.FetchLecture(params['lectureId'])));
        }
        this.cd.detectChanges()
      })

    // aggiorno i parametri del video dello store, manca parte API estrazione dati
    this.store.dispatch(new SetCamVideoUrl('http://127.0.0.1:8887/rtsp.mp4'))
    this.store.dispatch(new SetPcVideoUrl('http://127.0.0.1:8887/pvr.mp4'))
    this.store.dispatch(new SetTotalTime(991))
    this.store.select(s => s.video.camVideo).subscribe(data => {
      this.camVideo = data
    })


  }

  saveVideoState() {
    this.store.dispatch(new VideoActions.SetCurrentTime(this.camVideo.currentTime))
  }
}