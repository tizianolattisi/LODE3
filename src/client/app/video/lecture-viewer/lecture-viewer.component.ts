import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { ActivatedRoute } from '@angular/router';
import * as LectureActions from '../../store/lecture/lecture.actions'
import * as VideoActions from '../../store/video/video.actions'
import { Lecture } from '../../service/model/lecture';
import { VideoService } from '../../service/video.service'
import { LectureService } from '../../service/lecture.service'
import { Parser } from 'xml2js';
import { Layout } from '../../store/video/video.state'
import { Subscription } from 'rxjs/Subscription';
import { Annotation, DataType } from '../../service/model/annotation';
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

  layoutSelection: string; // determina la tipologia di player da visualizzare (lineare-tabulare)
  hasAnnotations: boolean // se true visualizza lo slider
  openNotes$: Observable<{ slideId: string; annotationId: string; }[]>; // note aperte

  private currentLectureSubs: Subscription
  private layoutSubs: Subscription
  private videoFetchSubs: Subscription
  private lectureFetchSubs: Subscription
  private tokenSubs: Subscription
  private slidesSubs: Subscription
  private fetchVideoSubs: Subscription
  private showSlidesSubs: Subscription

  /**
   * Metodo costruttore
   * @constructor
   * @param store - Store dei dati dell'utente
   * @param route - fornisce route attuale
   * @param videoService - service per l'estrazione dei dati dal file xml
   * @param lectureService - service per l'estrazione delle annotazioni
   * @param router - router per effettuare il redirect
   * @param tracker - classe per il tracking delle azioni dell'utente
   * @param dialog - dialog per la visualizzazione delle note scritte
   */
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private videoService: VideoService,
    private lectureService: LectureService,
    private router: Router,
    private tracker: TrackerService,
    public dialog: MatDialog
  ) {
  }

  /**
   * Inizializzazione del componente. Prende nome del corso e della lezione dall'url ed estrae i file dal file XML.
   * Il file XML viene richiesto a localhost/lectures/nome_corso/nome_lezione/data.xml
   */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let videoPath = params['content'];
      this.fetchVideoSubs = this.videoService.FetchVideoData(videoPath)
        .catch((err: Response) => {
          // se il file XML non è stato trovato mostro un alert
          let dialog = this.dialog.open(InfoDialogComponent, {
            width: '100vw',
            data: {
              title: 'Impossibile visualizzare la lezione',
              content: ""
            }
          })
          dialog.afterClosed().subscribe(() => {
            this.router.navigate(['']);
          });
          return Observable.throw(err);
        })
        .subscribe(data => {
          let parser = new Parser()
          parser.parseString(data, (err, result) => {
            result.data.camvideo[0].name = this.videoService.BASE_URL + '/' + result.data.camvideo[0].name
            if (result.data.pcvideo !== undefined) {
              result.data.pcvideo[0].name = this.videoService.BASE_URL + '/' + result.data.pcvideo[0].name
            }
            if (result.data.info[0].annotations === undefined) {
              result.data.info[0].annotations = false
            }
            if (result.data.info[0].logging === undefined) {
              result.data.info[0].logging = false
            }
            if (result.data.info[0].startDate === undefined) {
              result.data.info[0].startDate = 0
            }
            // calcolo layout pagina
            if (result.data.info[0].layout !== undefined && result.data.info[0].layout.toString().toUpperCase() === 'LINEAR') {
              result.data.info[0].layout = result.data.info[0].annotations.toString() === 'true' ? (result.data.pcvideo !== undefined ? Layout.LINEAR3 : Layout.LINEAR2) : (result.data.pcvideo !== undefined ? Layout.LINEAR2 : Layout.NONE)
            } else {
              result.data.info[0].layout = result.data.info[0].annotations.toString() === 'true' ? (result.data.pcvideo !== undefined ? Layout.TABULAR3 : Layout.TABULAR2) : (result.data.pcvideo !== undefined ? Layout.TABULAR2 : Layout.NONE)
            }
            this.hasAnnotations = result.data.info[0].annotations.toString() === 'true'
            result.data.info[0].logging = result.data.info[0].logging.toString() === 'true'
            this.tokenSubs = this.store.select(s => s.user.token).subscribe(token => {
              if (this.hasAnnotations && token !== null && token !== '') {
                // se le annotazioni sono attivate le estrae dal DB
                var values = params['content'].split('/')
                this.store.dispatch(new LectureActions.FetchLectureByName({ course: values[1], title: values[2] }))
                this.store.select(s => s.lecture.currentLecture).subscribe(lecture => {
                  if (lecture) {
                    let timestamp = lecture.uuid.toString().substring(0, 8)
                    let date = new Date(parseInt(timestamp, 16) * 1000)
                    result.data.info[0].startDate = date.getTime() / 1000
                    this.store.dispatch(new VideoActions.SetVideoData(result)) // setto i parametri del viewer ottenuti dal file xml
                    this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid)) // estraggo gli screenshot dell'utente
                    // estraggo annotazioni
                    this.lectureService.getUserAnnotations(lecture.uuid).subscribe(data => {
                      let allAnnotations = new Map<string, Annotation<DataType>[]>()
                      data.forEach((item) => {
                        const key = item.slideId;
                        const collection = allAnnotations.get(key);
                        if (!collection) {
                          allAnnotations.set(key, [item]);
                        } else {
                          collection.push(item);
                        }
                      })
                      this.store.dispatch(new VideoActions.SetCompleteAnnotations(allAnnotations))
                    })
                  }
                })
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
              } else {
                // se le annotazioni non sono attivate estrae i dati solo dal file XML
                let lecture: Lecture = {
                  live: false,
                  name: result.data.info[0].title,
                  course: result.data.info[0].course,
                  uuid: ''
                }
                this.store.dispatch(new LectureActions.SetCurrentLecture(lecture))
                this.store.dispatch(new VideoActions.SetVideoData(result)) // setto i parametri del viewer ottenuti dal file xml
              }
              this.store.select(s => s.user.email).subscribe(data => {
                this.tracker.sessionIdMaker(data, result.data.info[0].logging)
                this.tracker.trackEvent("title", result.data.info[0].title, result.data.info[0].course)
              }).unsubscribe()
            })
          })
        });
    })
    // estraggo dallo store il tipo di layout da visualizzare
    this.layoutSubs = this.store.select(s => s.video.videoLayout).subscribe(data => {
      this.layoutSelection = Layout[data]
    })
  }

  /**
   * Il componente si disiscrive da tutte le Subscription
   */
  ngOnDestroy() {
    this.store.dispatch(new VideoActions.ResetData())
    this.dialog.closeAll()
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
    if (this.showSlidesSubs !== undefined)
      this.showSlidesSubs.unsubscribe()
  }
}