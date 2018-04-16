import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { SetUpdatedTime } from '../../store/video/video.actions'
import * as SVG from 'svg.js';
import { Doc } from 'svg.js';
import { PL_FAVORITE_PATH, PL_GENERIC_PATH, PL_IMPORTANT_PATH, PL_QUESTION_PATH, PL_REMEMBER_PATH } from '../../service/tools/bookmark-tool'
import { Annotation, DataType, PencilData, NoteData, BookmarkData } from '../../service/model/annotation';
import { PL_ICON_PATH, PL_RADIUS, lightenDarkenColor } from '../../service/tools/note-tool'
import { G } from 'svg.js';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'note-slider',
  templateUrl: './note-slider.component.html',
  styleUrls: ['./note-slider.component.scss']
})
export class NoteSliderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('SVGCanvas') SVGCanvas: ElementRef;
  @ViewChild('annotationContainer') annotationContainer: ElementRef;

  startDate: number
  slides: Screenshot[]
  currentSlide: Screenshot

  private svgAnnotationContainer: Doc
  private allAnnotations: Map<string, Annotation<DataType>[]>

  private startDateSubs: Subscription
  private slideSubs: Subscription
  private annotationSubs: Subscription

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<NoteSliderComponent>
  ) { }

  ngOnInit() {

    this.startDateSubs = this.store.select(s => s.video.startTimestamp).subscribe(data => {
      this.startDate = data
    })
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
            } else if (actualAnnotation.type === 'bookmark') {
              this.drawBookmarkAnnotation(actualAnnotation as Annotation<BookmarkData>)
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
    this.store.select(s => s.lecture.currentSlideIndex).subscribe(data => {
      if (this.slides !== undefined) {
        this.currentSlide = this.slides[data]
      }
    })
  }

  public ngAfterViewInit(): void {
    this.slideSubs = this.store.select(s => s.lecture.slides).subscribe(data => {
      this.slides = data
      this.setCompleteSlides()
    })
    this.annotationSubs = this.store.select(s => s.video.allAnnotations).subscribe(data => {
      this.allAnnotations = data
      this.setCompleteSlides()
    })
  }


  drawBookmarkAnnotation(annotation: Annotation<BookmarkData>) {
    const placeholder = this.drawBookmarkPlaceholder(annotation.data.x, annotation.data.y, annotation.data.tag);
    placeholder.id(annotation.uuid);
  }


  private drawBookmarkPlaceholder(x: number, y: number, tag: string): G {
    const group = this.svgAnnotationContainer.group();
    group.translate(x, y);
    group.circle(PL_RADIUS).addClass('note-placeholder').fill('#333333').stroke({ color: lightenDarkenColor('#333333', 20), width: 5 });
    let path = PL_GENERIC_PATH;
    switch (tag) {
      case 'generic':
        path = PL_GENERIC_PATH;
        break;
      case 'important':
        path = PL_IMPORTANT_PATH;
        break;
      case 'question':
        path = PL_QUESTION_PATH;
        break;
      case 'remember':
        path = PL_REMEMBER_PATH;
        break;
      case 'favorite':
        path = PL_FAVORITE_PATH;
        break;
    }
    group.path(path).fill('#FFF').transform({ scaleX: 2, scaleY: 2 }).translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);

    return group;
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

  setTime(actual: Screenshot) {
    let timestamp = actual._id.toString().substring(0, 8)
    let date = new Date(parseInt(timestamp, 16) * 1000)
    this.store.dispatch(new SetUpdatedTime((date.getTime() - this.startDate) / 1000))
  }

  ngOnDestroy() {
    this.startDateSubs.unsubscribe()
    this.slideSubs.unsubscribe()
    this.annotationSubs.unsubscribe()
  }

}
