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

  private initialTime: number
  private screenshotIndex: number = -1
  private annotationIndex: number = 0
  private svgAnnotationContainer: Doc

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.svgAnnotationContainer = SVG.adopt(this.SVGCanvas.nativeElement) as Doc;
    this.store.select(s => s.video.startTimestamp).subscribe(data => this.initialTime = data)

    this.slidesSubsc = this.store.select(s => s.lecture.slides).subscribe(data => {
      this.updateSlides(data)
      this.annotationSubsc = this.store.select(s => s.video.allAnnotations).subscribe(data => {
        this.updateAnnotations(data)
      })

      this.updatedTimeSubsc = this.store.select(s => s.video.updatedTime).subscribe(data => {
        this.updateView(data)
      })

      this.currentTimeSubsc = this.store.select(s => s.video.currentTime).subscribe(data => {
        this.setCurrentView(data)
      })

    })
  }

  updateSlides(data: Screenshot[]) {
    this.slides = []
    for (let actual of data) {
      let timestamp = actual._id.toString().substring(0, 8)
      let date = new Date(parseInt(timestamp, 16) * 1000)
      let currentScreenshot: TimedScreenshot = { screenshot: actual, seconds: (date.getTime() - this.initialTime) / 1000 }
      this.slides.push(currentScreenshot)

    }
  }

  updateAnnotations(data: Map<string, Annotation<DataType>[]>) {
    if (this.slides !== undefined) {
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
  }

  setCurrentView(data: number) {
    if (this.slides[this.screenshotIndex + 1] !== undefined)
      if (this.screenshotIndex < this.slides.length - 1 && this.slides[this.screenshotIndex + 1].seconds < data) {
        this.screenshotIndex += 1
        this.currentSlide = this.slides[this.screenshotIndex].screenshot
        this.clearSVG()
      } else if (this.slides[this.screenshotIndex] !== undefined) {

        let actual = this.annotations.get(this.slides[this.screenshotIndex].screenshot._id)
        let isPossible = true
        while (isPossible) {
          if (this.annotationIndex < actual.length && actual[this.annotationIndex].seconds < data) {
            let actualAnnotation = actual[this.annotationIndex].annotation
            this.drawSVG(actualAnnotation)
            this.annotationIndex += 1
          } else {
            isPossible = false
          }
        }
      }
  }

  updateView(seconds: number) {
    if (this.slides !== undefined) {
      if (this.slides.length === 0 || this.slides[0].seconds > seconds) {
        this.screenshotIndex = -1
        this.currentSlide = undefined
      } else {
        if (this.slides[this.slides.length - 1].seconds <= seconds) {
          this.screenshotIndex = this.slides.length - 1
        } else {
          for (let i = 0; i < this.slides.length - 1; i += 1) {
            if (this.slides[i].seconds <= seconds && seconds < this.slides[i + 1].seconds) {
              this.screenshotIndex = i
              break
            }
          }
        }
        this.currentSlide = this.slides[this.screenshotIndex].screenshot
        if (this.annotations !== undefined && this.currentSlide !== undefined) {
          this.clearSVG()
          let slideAnnotation = this.annotations.get(this.currentSlide._id)
          if (slideAnnotation.length !== undefined && slideAnnotation.length > 0) {
            for (let x of slideAnnotation) {
              if (x.seconds > seconds) {
                this.annotationIndex = slideAnnotation.indexOf(x)
                break
              } else {
                this.drawSVG(x.annotation)
              }
            }
          }
        }
      }
    }
  }

  drawSVG(actualAnnotation: Annotation<DataType>) {
    if (actualAnnotation.type === 'pencil') {
      let pencilAnnotation = actualAnnotation as Annotation<PencilData>
      this.drawPencilAnnotation(pencilAnnotation)
    } else if (actualAnnotation.type === 'note') {
      let pencilAnnotation = actualAnnotation as Annotation<NoteData>
      this.drawNoteAnnotation(pencilAnnotation)
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
  drawPencilAnnotation(annotation: Annotation<PencilData>): void {
    const path = this.svgAnnotationContainer.path(annotation.data.path);
    path.stroke({ color: annotation.data.color, width: annotation.data.width });
    path.fill({ color: 'none' })
    path.id('a' + annotation.uuid);

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