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
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component'

@Component({
  selector: 'l3-lecture-viewer',
  templateUrl: './lecture-viewer.component.html',
  styleUrls: ['./lecture-viewer.component.scss']
})

/**
 * Componente principale del viewer. 
 * Contiene tutti i sottocomponenti necessari per la visualizzazione della videolezione.
 */
export class LectureViewerComponent implements OnInit, OnDestroy {

  lecture: Lecture; // utilizzato per estrarre i dati della lezione
  layoutSelection: string; // determina la tipologia di player da visualizzare (lineare-tabulare)
  hasAnnotations: boolean // se true visualizza lo slider
  openNotes$: Observable<{ slideId: string; annotationId: string; }[]>; // note aperte

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
  private showSlidesSubs: Subscription

  /**
   * Metodo costruttore
   * @constructor
   * @param store - Store dei dati dell'utente
   * @param cd - Change detector
   * @param route - fornisce route attuale
   * @param socketService - socket per l'estrazione delle annotazioni
   * @param videoService - service per l'estrazione dei dati dal file xml
   * @param tracker - classe per il tracking delle azioni dell'utente
   * @param dialog - dialog per la visualizzazione delle note scritte
   */
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

  /**
   * Inizializzazione del componente. Prende nome del corso e della lezione ed estrae i file dal file XML.
   * Il file XML viene richiesto a localhost:3000/lectures/nome_corso/nome_lezione/data.xml
   */
  ngOnInit() {
    this.store.select(s => s.user.email).subscribe(data => {
      this.tracker.sessionIdMaker(data) // setto l'id della sessione per il tracker con l'email dell'utente
    }).unsubscribe()

    this.videoFetchSubs = this.currentLectureSubs = this.store.select(s => s.lecture.currentLecture)
      .subscribe(lecture => { //estraggo dati lezione        
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
          this.fetchVideoSubs = this.videoService.FetchVideoData(this.lecture.course, this.lecture.name)
            .catch((err: Response) => {
              // se il file XML non è stato trovato mostro un alert
              this.dialog.open(InfoDialogComponent, {
                width: '100vw',
                data: {
                  title: 'Impossibile visualizzare la lezione',
                  content: ""
                }
              })
              return Observable.throw(err);
            })
            .subscribe(data => {
              let parser = new Parser()
              parser.parseString(data, (err, result) => {
                if (result.data.camvideo !== undefined)
                  result.data.camvideo[0].name = this.videoService.BASE_URL + '/lectures/' + this.lecture.course + '/' + this.lecture.name + '/' + result.data.camvideo[0].name
                result.data.pcvideo[0].name = this.videoService.BASE_URL + '/lectures/' + this.lecture.course + '/' + this.lecture.name + '/' + result.data.pcvideo[0].name
                if (result.data.info[0].annotations === undefined) {
                  result.data.info[0].annotations = false
                }
                let timestamp = this.lecture.uuid.toString().substring(0, 8)
                let date = new Date(parseInt(timestamp, 16) * 1000)
                result.data.info[0].startDate = date.getTime() / 1000
                result.data.info[0].startDate = 1519814600000 // uuid restituisce data sbagliata, setto valore a mano per il momento
                this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid)) // estraggo gli screenshot dell'utente
                this.store.dispatch(new VideoActions.SetVideoData(result)) // setto i parametri del viewer ottenuti dal file xml
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
          this.socketSubs.unsubscribe()
        }
      }
    });
    this.openNotes$ = this.store.select(s => s.annotation.openNotes);
    this.showSlidesSubs = this.store.select(s => s.video.showSlides).subscribe(data => {
      // dialog per il note slider
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

  /**
   * Il componente si disiscrive da tutte le Subscription
   */
  ngOnDestroy() {
    this.store.dispatch(new VideoActions.ResetData())
    if (this.layoutSubs !== undefined)
      this.layoutSubs.unsubscribe()
    if (this.currentLectureSubs !== undefined)
      this.currentLectureSubs.unsubscribe()
    if (this.videoFetchSubs !== undefined)
      this.videoFetchSubs.unsubscribe()
    if (this.lectureFetchSubs !== undefined)
      this.lectureFetchSubs.unsubscribe()
    if (this.tokenSubs !== undefined)
      this.tokenSubs.unsubscribe()
    if (this.slidesSubs !== undefined)
      this.slidesSubs.unsubscribe()
    if (this.fetchVideoSubs !== undefined)
      this.fetchVideoSubs.unsubscribe()
    if (this.showSlidesSubs !== undefined) {
      this.showSlidesSubs.unsubscribe()
    }
    if (this.socketService !== undefined) {
      this.socketService.close()
    }
  }
}