import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { ActivatedRoute } from '@angular/router';
import * as LectureActions from '../../store/lecture/lecture.actions'
import * as VideoActions from '../../store/video/video.actions'
import { Lecture } from '../../service/model/lecture';
import { VideoService } from '../../service/video.service'
import { Parser } from 'xml2js';
import { Layout } from '../../store/video/video.state'
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../service/socket.service';
import { Annotation, DataType } from '../../service/model/annotation';
import { FetchAnnotations } from '../../store/annotation/annotation.actions';
import { WsFromServerEvents } from '../../service/model/ws-msg';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'l3-lecture-viewer',
  templateUrl: './lecture-viewer.component.html',
  styleUrls: ['./lecture-viewer.component.scss']
})

export class LectureViewerComponent implements OnInit {

  lecture: Lecture;
  layoutSelection: string;
  hasAnnotations: boolean
  openNotes$: Observable<{ slideId: string; annotationId: string; }[]>;

  private allAnnotations: Map<string, Annotation<DataType>[]> = new Map<string, Annotation<DataType>[]>()
  private nSlides: number = 0

  private currentLectureSubs: Subscription
  private layoutSubs: Subscription
  private videoFetchSubs: Subscription
  private lectureFetchSubs: Subscription

  constructor(
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private videoService: VideoService
  ) {
  }

  ngOnInit() {

    this.videoFetchSubs = this.currentLectureSubs = this.store.select(s => s.lecture.currentLecture)
      .subscribe(lecture => {
        this.lecture = lecture;
        if (lecture) {
          this.store.select(s => s.user.token).subscribe(token => {
            this.socketService.open(token);
            this.store.select(s => s.lecture.slides).subscribe(data => {
              this.nSlides = data.length
              for (let x of data) {
                this.store.dispatch(new FetchAnnotations({ lectureId: this.lecture.uuid, slideId: x._id }));
              }
            })
          })

          this.videoService.FetchVideoData(this.lecture.uuid).subscribe(data => {
            let parser = new Parser()
            parser.parseString(data, (err, result) => {
              this.hasAnnotations = result.data.info[0].annotations.toString() === 'true'
              this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid))
              this.store.dispatch(new VideoActions.SetUpdatedTime(0))

              //setto tipo url di camVideo e tipo di layout
              if (result.data.camvideo !== undefined) {
                this.store.dispatch(new VideoActions.SetCamVideoUrl(this.videoService.BASE_URL + '/' + this.lecture.uuid + '/video/' + result.data.camvideo[0].name))
                if (this.hasAnnotations)
                  this.store.dispatch(new VideoActions.SetVideoLayout(Layout.LINEAR3))
                else
                  this.store.dispatch(new VideoActions.SetVideoLayout(Layout.LINEAR2))
              }
              else {
                this.store.dispatch(new VideoActions.SetCamVideoUrl(''))
                if (this.hasAnnotations)
                  this.store.dispatch(new VideoActions.SetVideoLayout(Layout.LINEAR2))
                else
                  this.store.dispatch(new VideoActions.SetVideoLayout(Layout.NONE))
              }
              this.store.dispatch(new VideoActions.SetPcVideoUrl(this.videoService.BASE_URL + '/' + this.lecture.uuid + '/video/' + result.data.pcvideo[0].name))
              this.store.dispatch(new VideoActions.SetTotalTime(parseInt(result.data.pcvideo[0].totaltime)))
              this.store.dispatch(new VideoActions.SetStartTimestamp(parseInt(result.data.info[0].startDate)))
              this.store.dispatch(new VideoActions.SetHasAnnotations(result.data.info[0].annotations.toString() === 'true'))
            });
          })
        } else {
          this.lectureFetchSubs = this.route.params.first().subscribe(params => this.store.dispatch(new LectureActions.FetchLecture(params['lectureId'])));
        }
        this.cd.detectChanges()
      })
    this.layoutSubs = this.store.select(s => s.video.videoLayout).subscribe(data => {
      this.layoutSelection = Layout[data]
    })
    this.socketService.onReceive().subscribe(msg => {
      if (msg.event === WsFromServerEvents.ANNOTATION_GET) {
        // Annotations from server
        const anns: Annotation<DataType>[] = msg.data;
        if (anns.length > 0) {
          let slideuuid = anns[0].slideId
          this.allAnnotations.set(slideuuid, anns)

        }
        if (this.allAnnotations.size === this.nSlides) {
          this.store.dispatch(new VideoActions.SetCompleteAnnotations(this.allAnnotations))
        }
      }
    });

    this.openNotes$ = this.store.select(s => s.annotation.openNotes);
  }

  ngDestroy() {
    this.store.dispatch(new VideoActions.SetVideoLayout(Layout.NONE))
    this.layoutSubs.unsubscribe()
    this.currentLectureSubs.unsubscribe()
    this.videoFetchSubs.unsubscribe()
    this.lectureFetchSubs.unsubscribe()
  }
}