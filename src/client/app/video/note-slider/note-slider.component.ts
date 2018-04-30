import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { SetUpdatedTime } from '../../store/video/video.actions'
import * as SVG from 'svg.js';
import { Doc } from 'svg.js';
import { Annotation, DataType } from '../../service/model/annotation';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogRef } from '@angular/material';
import { SetAnnotationContainer, SetTools } from '../../store/editor/editor.actions';
import { Tool } from '../../service/tools/tool';
import { TOOLS } from '../../service/tools/tool-opaque-token';
@Component({
  selector: 'note-slider',
  templateUrl: './note-slider.component.html',
  styleUrls: ['./note-slider.component.scss']
})

/**
 * Slider che permette di vedere tutti gli screenshot con le relative annotazioni
 */
export class NoteSliderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('SVGCanvas') SVGCanvas: ElementRef;
  @ViewChild('annotationContainer') annotationContainer: ElementRef;

  startDate: number // data inizio lezione
  slides: Screenshot[] // screenshot catturati
  currentSlide: Screenshot // screenshot attualmente visualizzato nello stream delle annotazioni

  private svgAnnotationContainer: Doc // canvas su cui vengono inserite le annotazioni
  private allAnnotations: Map<string, Annotation<DataType>[]> // tutte le annotazioni in formato <uuid_screenshot, annotations[]>

  private startDateSubs: Subscription
  private slideSubs: Subscription
  private annotationSubs: Subscription

  /**
   * Metodo costruttore
   * @param renderer renderer per la manipolazione del DOM
   * @param store store con i dati della sessione
   * @param dialogRef reference per essere considerato dialog
   * @param tools Tools da utilizzare per visualizzare le annotazioni
   */
  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<NoteSliderComponent>,
    @Inject(TOOLS) private tools: Tool<DataType>[]
  ) { }

  /**
   * Salva localmente il timestamp di inizio della lezione
   */
  ngOnInit() {
    this.startDateSubs = this.store.select(s => s.video.startTimestamp).subscribe(data => {
      this.startDate = data
    })
    this.store.dispatch(new SetTools(this.tools.map(t => t.getDescription())))
  }

  /**
   * Aggiunge a schermo, per ogni screenshot, le corrispondenti annotazioni
   */
  private setCompleteSlides() {
    this.renderer.setStyle(this.SVGCanvas.nativeElement, 'display', 'block')
    if (this.slides !== undefined && this.allAnnotations !== undefined) {
      this.SVGCanvas.nativeElement.innerHTML = '';
      for (let actualSlide of this.slides) {
        this.svgAnnotationContainer = SVG.adopt(this.SVGCanvas.nativeElement) as Doc;
        let slideAnnotations = this.allAnnotations.get(actualSlide._id)
        if (slideAnnotations !== undefined) {
          for (let actualAnnotation of slideAnnotations) {
            this.store.dispatch(new SetAnnotationContainer(this.svgAnnotationContainer));
            const tool = this.getTool(actualAnnotation.type);
            if (tool) {
              tool.drawAnnotation(actualAnnotation);
            }
          }
          let actualSVG = this.SVGCanvas.nativeElement.cloneNode(true)
          var divContainer = this.renderer.createElement('div');
          this.renderer.setStyle(divContainer, 'height', '8vw')
          this.renderer.appendChild(divContainer, actualSVG)
          this.renderer.appendChild(this.annotationContainer.nativeElement, divContainer)
          this.SVGCanvas.nativeElement.innerHTML = '';
        }
      }
    }
    this.renderer.setStyle(this.SVGCanvas.nativeElement, 'display', 'none')
    this.store.select(s => s.video.screenshotIndex).subscribe(data => {
      if (this.slides !== undefined) {
        this.currentSlide = this.slides[data]
      }
    })
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
   * Dopo l'inizializzazione salvo localmente gli screenshot e le annotazioni.
   * Successivamente chiamo setCompleteSlides.
   */
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

  /**
   * Aggiorna il currentTime con il timing dello screenshot
   * @param actual Screenshot da cui ricavare il timing
   */
  setTime(actual: Screenshot) {
    let timestamp = actual._id.toString().substring(0, 8)
    let date = new Date(parseInt(timestamp, 16) * 1000)
    this.store.dispatch(new SetUpdatedTime((date.getTime() - this.startDate) / 1000))
  }

  /**
  * Il componente si disiscrive da tutte le Subscription
  */
  ngOnDestroy() {
    if (this.startDateSubs !== undefined)
      this.startDateSubs.unsubscribe()
    if (this.slideSubs !== undefined)
      this.slideSubs.unsubscribe()
    if (this.annotationSubs !== undefined)
      this.annotationSubs.unsubscribe()
  }
}
