import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { Subscription } from 'rxjs/Subscription';
import * as SVG from 'svg.js';
import { Doc } from 'svg.js';
import { Annotation, DataType } from '../../service/model/annotation';
import { SetScreenshotIndex } from '../../store/video/video.actions'
import { SetAnnotationContainer, SetTools } from '../../store/editor/editor.actions';
import { Tool } from '../../service/tools/tool';
import { TOOLS } from '../../service/tools/tool-opaque-token';

@Component({
  selector: 'note-box',
  templateUrl: './note-box.component.html',
  styleUrls: ['./note-box.component.scss']
})

/**
 * Componente che rappresenta lo stream delle annotazioni
 */
export class NoteBoxComponent implements OnInit, OnDestroy {

  @Input('allowFullscreen') allowFullscreen: boolean = true; // true se è possibile andare a schermo intero

  @ViewChild('SVGCanvas') SVGCanvas: ElementRef;
  @ViewChild('noteBox') noteBox: ElementRef;

  currentSlide: Screenshot // screenshot attualmente visualizzato
  slides: TimedScreenshot[] // lista di screenshot temporizzati
  annotations: Map<string, TimedAnnotation[]> = new Map<string, TimedAnnotation[]>() // lista di annotazioni temporizzate

  private slidesSubsc: Subscription
  private annotationSubsc: Subscription
  private updatedTimeSubsc: Subscription
  private currentTimeSubsc: Subscription
  private playingSubsc: Subscription
  private speedSubsc: Subscription

  private initialTime: number //date che indica l'inizio della registrazione della lezione
  private screenshotIndex: number = -1 // indice dello screenshot attualmente visualizzato
  private annotationIndex: number = 0 // indice della prossima annotazione da visualizzare
  private svgAnnotationContainer: Doc // container in cui inserire i path delle annotazioni
  private playing: boolean = false // true se gli stream sono in esecuzione
  private speed: number = 1 // velocità di riproduzione degli stream

  /**
   * Metodo costruttore
   * @param store store in cui vengono salvati i dati della sessione
   * @param tools Tools da utilizzare per visualizzare le annotazioni
   */
  constructor(
    private store: Store<AppState>,
    @Inject(TOOLS) private tools: Tool<DataType>[]
  ) { }

  /**
   * Setta le variabili globali prendendole dallo store
   */
  ngOnInit() {
    this.store.dispatch(new SetScreenshotIndex(-1))
    this.svgAnnotationContainer = SVG.adopt(this.SVGCanvas.nativeElement) as Doc;
    this.store.select(s => s.video.startTimestamp).subscribe(data => this.initialTime = data)
    this.slidesSubsc = this.store.select(s => s.lecture.slides).subscribe(data => {
      this.setSlides(data)
      this.annotationSubsc = this.store.select(s => s.video.allAnnotations).subscribe(data => {
        this.setAnnotations(data)
      })
      this.updatedTimeSubsc = this.store.select(s => s.video.updatedTime).subscribe(data => {
        this.updateView(data)
      })
      this.currentTimeSubsc = this.store.select(s => s.video.currentTime).subscribe(data => {
        this.setCurrentView(data)
      })
    })
    this.playingSubsc = this.store.select(s => s.video.playing).subscribe(data => {
      this.playing = data
    })
    this.speedSubsc = this.store.select(s => s.video.speed).subscribe(data => {
      this.speed = data
    })

    this.store.dispatch(new SetAnnotationContainer(this.svgAnnotationContainer));
    this.store.dispatch(new SetTools(this.tools.map(t => t.getDescription())))
  }

  /**
   * Prende gli screenshot, gli abbina al secondo in cui devono essere visualizzati e gli riordina
   * @param data Lista degli screenshot della lezione
   */
  setSlides(data: Screenshot[]) {
    this.slides = []
    for (let actual of data) {
      let timestamp = actual._id.toString().substring(0, 8)
      let date = new Date(parseInt(timestamp, 16) * 1000)
      let currentScreenshot: TimedScreenshot = { screenshot: actual, seconds: (date.getTime() - this.initialTime) / 1000 }
      this.slides.push(currentScreenshot)

    }
    this.slides.sort((a, b) => {
      return a.seconds - b.seconds
    })
  }

  /**
   * Prende le annotazioni, le abbina al secondo in cui devono essere visualizzate e le riordina
   * @param data Lista delle annotazioni della lezione
   */
  setAnnotations(data: Map<string, Annotation<DataType>[]>) {
    for (let slide of this.slides) {
      let x = data.get(slide.screenshot._id)
      let currentAnnotations: TimedAnnotation[] = []
      if (x !== undefined) {
        for (let ann of x) {
          let actualDate = new Date(ann.timestamp * 1000)
          let current: TimedAnnotation = { annotation: ann, seconds: (actualDate.getTime() - this.initialTime) / 1000 }
          currentAnnotations.push(current)
        }
        currentAnnotations.sort((a, b) => {
          return a.seconds - b.seconds
        })
        this.annotations.set(slide.screenshot._id, currentAnnotations)
      }
    }
  }

  /**
   * Controlla se è necessario mostrare lo screenshot successivo
   * @param seconds timing attuale degli stream
   */
  setCurrentView(seconds: number) {
    if (this.slides[0] !== undefined) {
      if (this.slides[this.screenshotIndex + 1] !== undefined && this.slides[this.screenshotIndex + 1].seconds < seconds) {
        this.screenshotIndex += 1
        this.currentSlide = this.slides[this.screenshotIndex].screenshot
        this.annotationIndex = 0
        this.clearSVG()
        this.store.dispatch(new SetScreenshotIndex(this.screenshotIndex))
      }
      this.drawSVG(seconds)
    }
  }

  /**
   * Cerca quale screenshot deve essere visualizzato per uno specifico tempo
   * @param seconds timing di cui si vuole trovare lo screenshot corrispondente
   */
  updateView(seconds: number) {
    this.clearSVG()
    if (this.slides[0] !== undefined) {
      if (this.slides[0].seconds > seconds) {
        this.screenshotIndex = -1
        this.currentSlide = undefined
      } else {
        for (this.screenshotIndex = 0; this.screenshotIndex < this.slides.length; this.screenshotIndex += 1) {
          if (this.slides[this.screenshotIndex].seconds > seconds) {
            break
          }
        }
        this.screenshotIndex -= 1
        this.currentSlide = this.slides[this.screenshotIndex].screenshot
        this.annotationIndex = 0
        this.drawSVG(seconds)
      }
      this.store.dispatch(new SetScreenshotIndex(this.screenshotIndex))
    }
  }

  /**
   * Trova le annotazioni che devono essere mostrate a video.
   * Le prime n-1 vengono visualizzate immediatamente, mentre l'ultima viene visualizzata tramite un'animazione
   * @param seconds 
   */
  drawSVG(seconds: number) {
    this.store.dispatch(new SetAnnotationContainer(this.svgAnnotationContainer));
    if (this.currentSlide !== undefined) {
      let currentAnnotations = this.annotations.get(this.currentSlide._id)
      for (; this.annotationIndex < currentAnnotations.length; this.annotationIndex += 1) {
        if (currentAnnotations[this.annotationIndex].seconds <= seconds) {
          let actualAnnotation = currentAnnotations[this.annotationIndex].annotation
          const tool = this.getTool(actualAnnotation.type);
          if (tool) {
            tool.drawAnnotation(actualAnnotation);
            if (actualAnnotation.type === 'pencil') {
              let transitionsSeconds = 5
              if (currentAnnotations[this.annotationIndex + 1] === undefined) {
                if (this.slides[this.screenshotIndex + 1] !== undefined) {
                  transitionsSeconds = Math.min(transitionsSeconds, this.slides[this.screenshotIndex + 1].seconds - seconds)
                }
              } else {
                if (currentAnnotations[this.annotationIndex + 1].seconds <= seconds) {
                  transitionsSeconds = 0
                } else {
                  transitionsSeconds = Math.min(transitionsSeconds, currentAnnotations[this.annotationIndex + 1].seconds - seconds)
                }
              }
              transitionsSeconds /= this.speed
              //ANIMAZIONE
              if (this.playing) {
                let path = this.SVGCanvas.nativeElement.getElementById(actualAnnotation.uuid)
                var length = path.getTotalLength();
                path.style.transition = path.style.WebkitTransition =
                  'none';
                path.style.strokeDasharray = length + ' ' + length;
                path.style.strokeDashoffset = length;
                path.getBoundingClientRect();
                path.style.transition = path.style.WebkitTransition =
                  'stroke-dashoffset ' + transitionsSeconds + 's ease-in-out';
                path.style.strokeDashoffset = '0';
              }
            }
          }
        } else {
          break
        }
      }
    }
  }

  /**
   * Seleziona il tool corretto
   * @param type nome del tool
   * @returns tool da utilizzare, null se non esiste un tool con quel nome
   */
  private getTool(type: string): Tool<DataType> {
    if (!this.tools) {
      return null;
    }
    const index = this.tools.map(t => t.TYPE).indexOf(type);
    return index !== -1 ? this.tools[index] : null;
  }

  /**
   * Cancella tutte le annotazioni attualmente presenti nel canvas
   */
  clearSVG() {
    while (this.SVGCanvas.nativeElement.firstChild) {
      this.SVGCanvas.nativeElement.removeChild(this.SVGCanvas.nativeElement.firstChild);
    }
  }

  /**
   * Mostra lo stream fullscreen
   */
  goFullscreen() {
    this.noteBox.nativeElement.webkitRequestFullScreen()
  }

  /**
  * Il componente si disiscrive da tutte le Subscription
  */
  ngOnDestroy() {
    if (this.slidesSubsc !== undefined)
      this.slidesSubsc.unsubscribe()
    if (this.updatedTimeSubsc !== undefined)
      this.updatedTimeSubsc.unsubscribe()
    if (this.annotationSubsc !== undefined)
      this.annotationSubsc.unsubscribe()
    if (this.currentTimeSubsc !== undefined)
      this.currentTimeSubsc.unsubscribe()
    if (this.playingSubsc !== undefined)
      this.playingSubsc.unsubscribe()
    if (this.speedSubsc !== undefined)
      this.speedSubsc.unsubscribe()
  }
}

/**
 * Screenshot temporizzati
 */
class TimedScreenshot {
  screenshot: Screenshot
  seconds: number
}

/**
 * Annotazioni temporizzate
 */
class TimedAnnotation {
  annotation: Annotation<DataType>
  seconds: number
}