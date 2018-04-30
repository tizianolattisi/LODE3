import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { SetUpdatedTime, Play, Pause } from '../../store/video/video.actions'
import { Screenshot } from '../../service/model/screenshot';
import { Annotation, BookmarkData } from '../../service/model/annotation'
import { Subscription } from 'rxjs/Subscription';
import { TrackerService } from '../../service/tracker.service';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

/**
 * Componente che comprende la timeline e i marker delle annotazioni
 */
export class TimelineComponent implements OnInit, OnDestroy {

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('viewedBar') viewedBar: ElementRef;

  totalTime: number // durata complessiva del video
  currentTime: number // timing corrente del video
  slides: Screenshot[] // lista degli screenshot
  startDate: number // timestamp di inizio lezione
  hasAnnotations: boolean // true se le annotazioni sono attivate per la lezione
  currentSlide: Screenshot // screenshot attualmente visualizzato nello stream delle annotazioni
  bookmarks: Annotation<BookmarkData>[] = [] // lista di annotazioni di tipo "bookmark"

  private timeDrag: boolean = false // true se l'utente sta effettuando il drag della timeline
  private playing: boolean // true se il video è in esecuzione
  private jumpFrom: number = 0 // currentTime in cui l'utente ha iniziato a effettuare il drag della timeline
  private playingWhileChange: boolean // true se quando l'utente effettua il drag il video era in esecuzione

  private currentSlideSubsc: Subscription
  private videoSubsc: Subscription
  private slidesSubsc: Subscription
  private currentTimeSubsc: Subscription

  /**
   * Metodo costruttore
   * @param store store in cui vengono salvati i dati della sessione
   * @param tracker service per i log
   */
  constructor(
    private store: Store<AppState>,
    private tracker: TrackerService) {
  }

  /**
   * Inizializza le variabili con i dati della sessione
   */
  ngOnInit() {
    this.videoSubsc = this.store.select(s => s.video).subscribe(data => {
      this.totalTime = data.totalTime
      this.hasAnnotations = data.hasAnnotations
      this.startDate = data.startTimestamp
      this.playing = data.playing
    })
    this.currentTimeSubsc = this.store.select(s => s.video.currentTime).subscribe(data => {
      this.currentTime = data
      this.viewedBar.nativeElement.style.width = this.percentageViewed(data)
    })
    this.slidesSubsc = this.store.select(s => s.lecture.slides).subscribe(data => {
      this.slides = data
    })

    this.currentSlideSubsc = this.store.select(s => s.video.screenshotIndex).subscribe(data => {
      if (this.slides !== undefined) {
        this.currentSlide = this.slides[data]
      }
    })
    // tra tutte le annotazioni seleziona solo quelle di tipo "bookmark"
    this.store.select(s => s.video.allAnnotations).subscribe(data => {
      this.bookmarks = []
      if (data !== undefined) {
        let keys = Array.from(data.keys());
        for (let key of keys) {
          let annotations = data.get(key);
          if (annotations !== undefined) {
            for (let current of annotations) {
              if (current.type === 'bookmark') {
                this.bookmarks.push(current as Annotation<BookmarkData>)
              }
            }
          }
        }
      }
    })
  }
  /**
   * Data un'annotazione di tipo "Bookmark" restituisce la percentuale di video vista nel momento
   * in cui appare tale annotazione
   * @param bm bookmark di cui si vuole sapere il timing
   */
  bookmarkPosition(bm: Annotation<BookmarkData>): string {
    let date = new Date(bm.timestamp * 1000)
    let sec = (date.getTime() - this.startDate) / 1000
    return this.percentageViewed(sec)
  }

  /**
   * Quando l'utente preme sulla timebar entra in modalità "timeDrag" e viene aggiorata la barra in base
   * alla posizione del cursore
   * @param event evento di tipo mouse down sulla timebar
   */
  timebarMouseDown(event: MouseEvent) {
    this.jumpFrom = this.currentTime
    this.timeDrag = true;
    this.playingWhileChange = this.playing
    this.store.dispatch(new Pause())
    this.updateBar(event);

  }

  /**
   * Se l'utente è entrato in "timeDrag" premendo sulla timebar, ogni volta che muove il mouse aggiorna
   * la barra.
   * @param event evento di tipo mouse drag sulla timebar
   */
  timebarMouseMove(event: MouseEvent) {
    if (this.timeDrag) {
      this.updateBar(event);
    }
  }

  /**
   * Quando l'utente rilascia il click del mouse effettua l'ultimo aggiornamento della timebar e
   * esce dalla modalità "timeDrag"
   * @param event evento di tipo mouse up sulla timebar
   */
  timebarMouseUp(event: MouseEvent) {
    if (this.timeDrag) {
      this.timeDrag = false;
      let newTime = this.updateBar(event);
      this.store.dispatch(new SetUpdatedTime(newTime))
      if (this.playingWhileChange)
        this.store.dispatch(new Play())
      this.tracker.trackEvent("jump", this.jumpFrom, newTime);
    }

  }

  /**
   * Data la posizione del cursore sulla timebar, trova la corrispondente percentuale di video vista
   * e aggiorna il currentTime.
   * @param event - evento da cui ricavare la posizione del cursore
   * @returns secondi corrispondenti alla posizione del cursore
   */
  private updateBar(event: MouseEvent): number {
    let rect = this.progressBar.nativeElement.getBoundingClientRect()
    let newTime = ((event.clientX - rect.left) * this.totalTime) / (rect.right - rect.left)
    this.currentTime = newTime
    this.viewedBar.nativeElement.style.width = this.percentageViewed(newTime)
    return newTime
  }

  /**
   * Dato un timing restituisce la percentuale di video vista.
   * @param sec Current time
   * @returns stringa nel formato <percentage>%
   */
  private percentageViewed(sec: number): string {
    let percentage = (sec * 100) / this.totalTime
    if (percentage < 0) {
      return '0%'
    } else if (percentage > 100) {
      return '100%'
    } else {
      return percentage + '%'
    }
  }

  /**
   * Dato uno screenshot restituisce il timing (sotto forma di percentuale vista) in cui questo
   * viene visualizzato
   * @param slide screenshot di cui si vuole sapere il timing
   */
  markerPosition(slide: Screenshot): string {
    let sec = 0
    let timestamp = slide._id.toString().substring(0, 8)
    let date = new Date(parseInt(timestamp, 16) * 1000)
    sec = (date.getTime() - this.startDate) / 1000
    return this.percentageViewed(sec)

  }

  /**
   * Data una annotazione di tipo "Bookmark", setta il currentTime
   * in cui questo viene visualizzato 
   * @param bm bookmark a cui si vuole saltare
   */
  setTimeBookmark(bm: Annotation<BookmarkData>) {
    let date = new Date(bm.timestamp * 1000)
    let sec = (date.getTime() - this.startDate) / 1000
    this.store.dispatch(new SetUpdatedTime(sec))
    this.viewedBar.nativeElement.style.width = this.percentageViewed(sec)
  }

  /**
   * Dato uno screenshot, setta il currentTime in cui questo viene visualizzato 
   * @param slide screenshot al quale si vuole saltare
   */
  setTimeMarker(slide: Screenshot) {
    let sec = 0
    let timestamp = slide._id.toString().substring(0, 8)
    let date = new Date(parseInt(timestamp, 16) * 1000)
    sec = (date.getTime() - this.startDate) / 1000
    this.store.dispatch(new SetUpdatedTime(sec))
    this.viewedBar.nativeElement.style.width = this.percentageViewed(sec)
  }

  /**
   * Il componente si disiscrive da tutte le Subscription
   */
  ngOnDestroy() {
    if (this.videoSubsc !== undefined)
      this.videoSubsc.unsubscribe()
    if (this.currentSlideSubsc !== undefined)
      this.currentSlideSubsc.unsubscribe()
    if (this.slidesSubsc !== undefined)
      this.slidesSubsc.unsubscribe()
    if (this.currentTimeSubsc !== undefined)
      this.currentTimeSubsc.unsubscribe()
  }
}
