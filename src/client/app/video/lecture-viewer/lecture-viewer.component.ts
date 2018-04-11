import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
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
import { TrackerService } from '../../service/tracker.service';
import { MatDialog } from '@angular/material';
import { NoteSliderComponent } from '../note-slider/note-slider.component'

@Component({
  selector: 'l3-lecture-viewer',
  templateUrl: './lecture-viewer.component.html',
  styleUrls: ['./lecture-viewer.component.scss']
})

export class LectureViewerComponent implements OnInit, OnDestroy {

  lecture: Lecture; // utilizzato per estrarre i dati della lezione
  layoutSelection: string; // determina la tipologia di player da visualizzare (lineare-tabulare)
  hasAnnotations: boolean // se true visualizza lo slider
  openNotes$: Observable<{ slideId: string; annotationId: string; }[]>;

  private allAnnotations: Map<string, Annotation<DataType>[]> = new Map<string, Annotation<DataType>[]>()
  private nSlides: number = 0

  private currentLectureSubs: Subscription
  private layoutSubs: Subscription
  private videoFetchSubs: Subscription
  private lectureFetchSubs: Subscription
  private socketSubs: Subscription
  private tokenSubs: Subscription
  private slidesSubs: Subscription
  private fetchVideoSubs: Subscription

  constructor(
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private videoService: VideoService,
    private tracker: TrackerService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.select(s => s.user.email).subscribe(data => {
      this.tracker.sessionIdMaker(data)
    }).unsubscribe()

    this.videoFetchSubs = this.currentLectureSubs = this.store.select(s => s.lecture.currentLecture)
      .subscribe(lecture => {
        //estraggo dati lezione
        this.lecture = lecture;
        if (lecture) {
          this.tracker.trackEvent("title", lecture.name, lecture.course)
          this.tokenSubs = this.store.select(s => s.user.token).subscribe(token => {
            this.socketService.open(token); // apro soket per annotazioni
            this.slidesSubs = this.store.select(s => s.lecture.slides).subscribe(data => {
              this.nSlides = data.length
              for (let x of data) {
                // prendo annotazioni per ciascuna slide
                this.store.dispatch(new FetchAnnotations({ lectureId: this.lecture.uuid, slideId: x._id }));
              }
            })
          })
          // estrazione dei dati del video dal file XML
          this.fetchVideoSubs = this.videoService.FetchVideoData(this.lecture.uuid).subscribe(data => {
            let parser = new Parser()
            parser.parseString(data, (err, result) => {
              if (result.data.camvideo !== undefined)
                result.data.camvideo[0].name = this.videoService.BASE_URL + '/' + this.lecture.uuid + '/video/' + result.data.camvideo[0].name
              result.data.pcvideo[0].name = this.videoService.BASE_URL + '/' + this.lecture.uuid + '/video/' + result.data.pcvideo[0].name
              this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid))
              this.store.dispatch(new VideoActions.SetVideoData(result))
              this.hasAnnotations = result.data.info[0].annotations.toString() === 'true'
            });
          })
        } else {
          this.lectureFetchSubs = this.route.params.first().subscribe(params => this.store.dispatch(new LectureActions.FetchLecture(params['lectureId'])));
        }
        this.cd.detectChanges()
      })
    // setto valore layout
    this.layoutSubs = this.store.select(s => s.video.videoLayout).subscribe(data => {
      this.layoutSelection = Layout[data]
    })
    this.socketSubs = this.socketService.onReceive().subscribe(msg => {
      if (msg.event === WsFromServerEvents.ANNOTATION_GET) {
        // estraggo annotazioni dal server
        const anns: Annotation<DataType>[] = msg.data;
        if (anns.length > 0) {
          let slideuuid = anns[0].slideId
          this.allAnnotations.set(slideuuid, anns)

        }
        if (this.allAnnotations.size === this.nSlides) {
          // se ho estratto le annotazioni per ogni slide aggiorno lo store
          this.store.dispatch(new VideoActions.SetCompleteAnnotations(this.allAnnotations))
        }
      }
    });
    this.openNotes$ = this.store.select(s => s.annotation.openNotes);

    this.store.select(s => s.video.showSlides).subscribe(data => {
      if (data) {
        let dialog = this.dialog.open(NoteSliderComponent, {
          width: '100vw'
        });
        dialog.afterClosed().subscribe(result => {
          this.store.dispatch(new VideoActions.ShowSlides(false))
        });
      }
    })
  }

  ngOnDestroy() {
    this.store.dispatch(new VideoActions.SetVideoLayout(Layout.NONE))
    this.layoutSubs.unsubscribe()
    this.currentLectureSubs.unsubscribe()
    this.videoFetchSubs.unsubscribe()
    if (this.lectureFetchSubs !== undefined) {
      this.lectureFetchSubs.unsubscribe()
    }
    this.socketSubs.unsubscribe()
    this.tokenSubs.unsubscribe()
    this.slidesSubs.unsubscribe()
    this.fetchVideoSubs.unsubscribe()
    this.socketService.close()
  }
}