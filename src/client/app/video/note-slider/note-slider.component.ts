import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { Observable } from 'rxjs/Observable';
import { SetUpdatedTime } from '../../store/video/video.actions'
import * as SVG from 'svg.js';
import { Doc } from 'svg.js';
import { Annotation, DataType, PencilData, NoteData } from '../../service/model/annotation';
import { PL_ICON_PATH, PL_RADIUS, lightenDarkenColor } from '../../service/tools/note-tool'
import { G } from 'svg.js';

@Component({
  selector: 'note-slider',
  templateUrl: './note-slider.component.html',
  styleUrls: ['./note-slider.component.scss']
})
export class NoteSliderComponent implements OnInit, AfterViewInit {

  private svgAnnotationContainer: Doc

  uuid$: Observable<string>
  slides$: Observable<Screenshot[]>
  startDate: number

  @ViewChild('SVGCanvas') SVGCanvas: ElementRef;
  @ViewChild('annotationContainer') annotationContainer: ElementRef;
  private slides: Screenshot[]
  private allAnnotations: Map<string, Annotation<DataType>[]>

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {

    this.uuid$ = this.store.select(s => s.lecture.currentLecture.uuid)
    this.slides$ = this.store.select(s => s.lecture.slides)
    this.startDate = 20171129045450297000
  }

  private setCompleteSlides() {
    this.SVGCanvas.nativeElement.style.display = "block"
    if (this.slides !== undefined && this.allAnnotations !== undefined) {
      while (this.annotationContainer.nativeElement.firstChild) {
        this.annotationContainer.nativeElement.removeChild(this.annotationContainer.nativeElement.firstChild);
      }
      for (let actualSlide of this.slides) {
        this.svgAnnotationContainer = SVG.adopt(this.SVGCanvas.nativeElement) as Doc;
        let slideAnnotations = this.allAnnotations.get(actualSlide._id)
        if (slideAnnotations !== undefined) {
          for (let actualAnnotation of slideAnnotations) {
            if (actualAnnotation.type === 'pencil') {
              let pencilAnnotation = actualAnnotation as Annotation<PencilData>
              this.drawPencilAnnotation(pencilAnnotation)
            } else if (actualAnnotation.type === 'note') {
              let pencilAnnotation = actualAnnotation as Annotation<NoteData>
              this.drawNoteAnnotation(pencilAnnotation)
            }
          }
          let actualSVG = this.SVGCanvas.nativeElement.cloneNode(true)
          var divContainer = document.createElement("div");
          divContainer.style.height = "8vw"
          divContainer.appendChild(actualSVG)
          this.annotationContainer.nativeElement.appendChild(divContainer)
          while (this.SVGCanvas.nativeElement.firstChild) {
            this.SVGCanvas.nativeElement.removeChild(this.SVGCanvas.nativeElement.firstChild);
          }
        }
      }
    }
    this.SVGCanvas.nativeElement.style.display = "none"
  }

  public ngAfterViewInit(): void {
    this.store.select(s => s.lecture.slides).subscribe(data => {
      this.slides = data
      this.setCompleteSlides()
    })
    this.store.select(s => s.video.allAnnotations).subscribe(data => {
      this.allAnnotations = data
      this.setCompleteSlides()
    })
  }

  /*
    Metodo che disegna appunti di tipo "matita"
  */
  drawPencilAnnotation(annotation: Annotation<PencilData>): void {
    const path = this.svgAnnotationContainer.path(annotation.data.path);
    path.stroke({ color: annotation.data.color, width: annotation.data.width });
    path.fill({ color: 'none' });
    path.id(annotation.uuid);
  }
  /*
    Metodo che disegna appunti di tipo "nota"
  */
  drawNoteAnnotation(annotation: Annotation<NoteData>): void {
    const placeholder = this.drawPlaceholder(annotation.data.x, annotation.data.y, annotation.data.color);
    placeholder.id(annotation.uuid);
  }

  /*
    Disegna il placeholder per appunti di tipo "nota"
  */
  private drawPlaceholder(x: number, y: number, color: string): G {
    const group = this.svgAnnotationContainer.group();
    group.translate(x, y);
    group.circle(PL_RADIUS).addClass('note-placeholder').fill({ color }).stroke({ color: lightenDarkenColor(color, 20), width: 5 });
    group.path(PL_ICON_PATH).fill('#FFF').transform({ scaleX: 2, scaleY: 2 }).translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);

    return group;
  }

  setTime(slide: Screenshot) {
    this.store.dispatch(new SetUpdatedTime(this.secondsDifference(slide.timestamp, this.startDate)))
  }

  private secondsDifference(timestamp1: number, timestamp2: number): number {
    timestamp1 /= 1000
    timestamp2 /= 1000

    let year1 = Math.floor(timestamp1 / 10000000000000)
    let year2 = Math.floor(timestamp2 / 10000000000000)
    timestamp1 = timestamp1 - year1 * 10000000000000
    timestamp2 = timestamp2 - year2 * 10000000000000

    let month1 = Math.floor(timestamp1 / 100000000000)
    let month2 = Math.floor(timestamp2 / 100000000000)
    timestamp1 = timestamp1 - month1 * 100000000000
    timestamp2 = timestamp2 - month2 * 100000000000
    if (year1 - year2 > 0)
      month1 += (year1 - year2) * 12

    let day1 = Math.floor(timestamp1 / 1000000000)
    let day2 = Math.floor(timestamp2 / 1000000000)
    timestamp1 = timestamp1 - day1 * 1000000000
    timestamp2 = timestamp2 - day2 * 1000000000
    if (month1 - month2 > 0)
      day1 += (month1 - month2) * 31

    let hour1 = Math.floor(timestamp1 / 10000000)
    let hour2 = Math.floor(timestamp2 / 10000000)
    timestamp1 = timestamp1 - hour1 * 10000000
    timestamp2 = timestamp2 - hour2 * 10000000
    if (day1 - day2 > 0)
      hour1 += (day1 - day1) * 24

    let minutes1 = Math.floor(timestamp1 / 100000)
    let minutes2 = Math.floor(timestamp2 / 100000)
    timestamp1 = timestamp1 - minutes1 * 100000
    timestamp2 = timestamp2 - minutes2 * 100000
    if (hour1 - hour2 > 0)
      minutes1 += (hour1 - hour2) * 60

    let seconds1 = Math.floor(timestamp1 / 1000)
    let seconds2 = Math.floor(timestamp2 / 1000)
    timestamp1 = timestamp1 - seconds1 * 1000
    timestamp2 = timestamp2 - seconds2 * 1000
    if (minutes1 - minutes2 > 0)
      seconds1 += (minutes1 - minutes2) * 60

    if (timestamp2 - timestamp1 < 0) {
      timestamp1 = (-(timestamp2 % -1000) + timestamp1 % 1000)
    } else {
      timestamp1 = timestamp1 - timestamp2
    }

    return (seconds1 - seconds2) + (timestamp1 / 1000)

  }
}
