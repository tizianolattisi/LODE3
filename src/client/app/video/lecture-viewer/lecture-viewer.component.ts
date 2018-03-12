import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { ActivatedRoute } from '@angular/router';
import * as LectureActions from '../../store/lecture/lecture.actions'
import * as VideoActions from '../../store/video/video.actions'
import { Subscription } from 'rxjs/Subscription';
import { Lecture } from '../../service/model/lecture';
import { VideoService } from '../../service/video.service'
import { Parser } from 'xml2js';

@Component({
  selector: 'l3-lecture-viewer',
  templateUrl: './lecture-viewer.component.html',
  styleUrls: ['./lecture-viewer.component.scss']
})
export class LectureViewerComponent implements OnInit {

  private lectureSubscr: Subscription;
  private camVideo: HTMLVideoElement;
  lecture: Lecture;
  layoutSelection: string;
  hasAnnotations: boolean

  constructor(
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new VideoActions.SetVideoLayout('linear-layout'))
    this.lectureSubscr = this.store.select(s => s.lecture.currentLecture)
      .subscribe(lecture => {
        this.lecture = lecture;
        if (lecture) {
          this.videoService.FetchVideoData(this.lecture.uuid).subscribe(data => {
            let parser = new Parser()
            parser.parseString(data, (err, result) => {
              this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid))
              this.store.dispatch(new VideoActions.SetUpdatedTime(0))
              this.store.dispatch(new VideoActions.SetVideoLayout('linear-layout'))
              if (result.data.camvideo !== undefined)
                this.store.dispatch(new VideoActions.SetCamVideoUrl(this.videoService.BASE_URL + '/' + this.lecture.uuid + '/video/' + result.data.camvideo[0].name))
              else
                this.store.dispatch(new VideoActions.SetCamVideoUrl(''))
              this.store.dispatch(new VideoActions.SetPcVideoUrl(this.videoService.BASE_URL + '/' + this.lecture.uuid + '/video/' + result.data.pcvideo[0].name))
              this.store.dispatch(new VideoActions.SetTotalTime(parseInt(result.data.pcvideo[0].totaltime)))
              this.store.dispatch(new VideoActions.SetStartTimestamp(parseInt(result.data.info[0].totaltime)))
              this.store.dispatch(new VideoActions.SetHasAnnotations(result.data.info[0].annotations.toString() === 'true'))
              this.store.dispatch(new VideoActions.SetStartTimestamp(parseInt(result.data.info[0].starttime)))
              this.hasAnnotations = result.data.info[0].annotations.toString() === 'true'

            });


          })

        } else {
          this.route.params.first().subscribe(params => this.store.dispatch(new LectureActions.FetchLecture(params['lectureId'])));
        }
        this.cd.detectChanges()
      })

    this.store.select(s => s.video.pcVideo).subscribe(data => {
      this.camVideo = data
    })

    this.store.select(s => s.video.videoLayout).subscribe(data => {
      this.layoutSelection = data
    })




  }

  saveVideoState() {
    this.store.dispatch(new VideoActions.SetUpdatedTime(this.camVideo.currentTime))
  }

  ngDestroy() {
    this.store.dispatch(new VideoActions.SetVideoLayout('false'))
  }
}