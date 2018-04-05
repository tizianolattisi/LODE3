import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { Subscription } from 'rxjs/Subscription';
import * as SVG from 'svg.js';
import { Doc } from 'svg.js';
import { Annotation, DataType, PencilData, NoteData } from '../../service/model/annotation';
import { PL_ICON_PATH, PL_RADIUS, lightenDarkenColor } from '../../service/tools/note-tool'
import { G } from 'svg.js';
import { OpenNote } from '../../store/annotation/annotation.actions';
import { SetCurrentSlide } from '../../store/lecture/lecture.actions'

@Component({
  selector: 'note-box',
  templateUrl: './note-box.component.html',
  styleUrls: ['./note-box.component.scss']
})
export class NoteBoxComponent implements OnInit, OnDestroy {

  @Input('allowFullscreen') allowFullscreen: boolean = true;

  @ViewChild('SVGCanvas') SVGCanvas: ElementRef;
  @ViewChild('noteBox') noteBox: ElementRef;

  currentSlide: Screenshot
  slides: TimedScreenshot[]
  annotations: Map<string, TimedAnnotation[]> = new Map<string, TimedAnnotation[]>()

  private slidesSubsc: Subscription
  private annotationSubsc: Subscription
  private updatedTimeSubsc: Subscription
  private currentTimeSubsc: Subscription
  private playingSubsc: Subscription
  private speedSubsc: Subscription

  private initialTime: number
  private screenshotIndex: number = -1
  private annotationIndex: number = 0
  private svgAnnotationContainer: Doc
  private playing: boolean = false
  private speed: number = 1

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new SetCurrentSlide(-1))
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
  }

  setSlides(data: Screenshot[]) {
    this.slides = []
    for (let actual of data) {
      let timestamp = actual._id.toString().substring(0, 8)
      let date = new Date(parseInt(timestamp, 16) * 1000)
      let currentScreenshot: TimedScreenshot = { screenshot: actual, seconds: (date.getTime() - this.initialTime) / 1000 }
      this.slides.push(currentScreenshot)

    }
  }

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
        this.annotations.set(slide.screenshot._id, currentAnnotations)
      }
    }
  }

  setCurrentView(seconds: number) {
    if (this.slides[0] !== undefined) {
      if (this.slides[this.screenshotIndex + 1] !== undefined && this.slides[this.screenshotIndex + 1].seconds < seconds) {
        this.screenshotIndex += 1
        this.currentSlide = this.slides[this.screenshotIndex].screenshot
        this.annotationIndex = 0
        this.clearSVG()
        this.store.dispatch(new SetCurrentSlide(this.screenshotIndex))
      }
      this.drawSVG(seconds)
    }
  }

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
      this.store.dispatch(new SetCurrentSlide(this.screenshotIndex))
    }
  }

  drawSVG(seconds: number) {
    if (this.currentSlide !== undefined) {
      let currentAnnotations = this.annotations.get(this.currentSlide._id)
      for (; this.annotationIndex < currentAnnotations.length; this.annotationIndex += 1) {
        if (currentAnnotations[this.annotationIndex].seconds <= seconds) {
          let actualAnnotation = currentAnnotations[this.annotationIndex].annotation
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
            let pencilAnnotation = actualAnnotation as Annotation<PencilData>
            transitionsSeconds /= this.speed
            this.drawPencilAnnotation(pencilAnnotation, transitionsSeconds)
          } else if (actualAnnotation.type === 'note') {
            let pencilAnnotation = actualAnnotation as Annotation<NoteData>
            this.drawNoteAnnotation(pencilAnnotation)
          }
        } else {
          break
        }
      }
    }
  }

  clearSVG() {
    while (this.SVGCanvas.nativeElement.firstChild) {
      this.SVGCanvas.nativeElement.removeChild(this.SVGCanvas.nativeElement.firstChild);
    }
  }

  /*
    Metodo che disegna appunti di tipo "matita"
  */
  drawPencilAnnotation(annotation: Annotation<PencilData>, seconds: number): void {
    const createdPath = this.svgAnnotationContainer.path(annotation.data.path);
    createdPath.stroke({ color: annotation.data.color, width: annotation.data.width });
    createdPath.fill({ color: 'none' })
    createdPath.id('a' + annotation.uuid);

    //ANIMAZIONE
    if (this.playing) {
      let path = this.SVGCanvas.nativeElement.querySelector('#' + 'a' + annotation.uuid)
      var length = path.getTotalLength();
      path.style.transition = path.style.WebkitTransition =
        'none';
      path.style.strokeDasharray = length + ' ' + length;
      path.style.strokeDashoffset = length;
      path.getBoundingClientRect();
      path.style.transition = path.style.WebkitTransition =
        'stroke-dashoffset ' + seconds + 's ease-in-out';
      path.style.strokeDashoffset = '0';
    }
  }
  /*
    Metodo che disegna appunti di tipo "nota"
  */
  drawNoteAnnotation(annotation: Annotation<NoteData>): void {
    const placeholder = this.drawPlaceholder(annotation.data.x, annotation.data.y, annotation.data.color);
    placeholder.id(annotation.uuid);
    this.addHandlers(placeholder, annotation.slideId, annotation.uuid);
  }

  /*
    Disegna il placeholder per appunti di tipo "nota"
  */
  private drawPlaceholder(x: number, y: number, color: string): G {
    const group = this.svgAnnotationContainer.group();
    group.translate(x, y);
    group.circle(PL_RADIUS).addClass('note-placeholder').fill({ color }).stroke({ color: lightenDarkenColor(color, 20), width: 5 });
    // group.path(PL_ICON_PATH).fill('#FFF').transform({ scaleX: 2, scaleY: 2 }).translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);
    group.path(PL_ICON_PATH).fill('#FFF').translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);
    return group;
  }

  private addHandlers(placeholder: G, slideId: string, annotationId: string) {
    placeholder.click(() => {
      this.store.dispatch(new OpenNote({ slideId, annotationId }));
    });
  }

  goFullscreen() {
    this.noteBox.nativeElement.webkitRequestFullScreen()
  }

  ngOnDestroy() {
    this.slidesSubsc.unsubscribe()
    this.updatedTimeSubsc.unsubscribe()
    this.annotationSubsc.unsubscribe()
    this.currentTimeSubsc.unsubscribe()
    this.playingSubsc.unsubscribe()
    this.speedSubsc.unsubscribe()
  }
}



class TimedScreenshot {
  screenshot: Screenshot
  seconds: number
}

class TimedAnnotation {
  annotation: Annotation<DataType>
  seconds: number
}