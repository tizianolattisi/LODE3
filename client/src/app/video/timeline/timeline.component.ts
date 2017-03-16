import {Component, OnInit, ViewChild, Input, ElementRef, SimpleChanges} from '@angular/core';
import {StoreService} from "../../shared/store.service";
import {AnnotationManager} from "../../annotation/AnnotationManager";
import {BaseAnnotation} from "../../annotation/model/BaseAnnotation";
import {NoteTool} from "../../annotation/tools/NoteTool";

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {


  @ViewChild('timelinePast') timelinePastElem: ElementRef;
  @ViewChild('timeline') timelineElem: ElementRef;

  @Input('highlightedNote') highlightedNote: string;
  @Input('hidePlaceholders') hidePlaceholders: boolean;

  slides: any[] = [];
  annotations: any[] = [];

  highlightedPoint: string;

  public constructor(private storeService: StoreService, public am: AnnotationManager) {
  }

  ngOnInit(): void {
    this.storeService.currentTime.subscribe((time)=> {
      this.timelinePastElem.nativeElement.style.width = this.getPosition(time);
    });

    if (!this.hidePlaceholders) {
      this.storeService.lodeSlides.subscribe((lodeSlides)=> {
        if (lodeSlides) {
          this.slides = lodeSlides.slides;
        }
      });

      this.am.allAnnotations.subscribe(anns => {
        if (anns) {
          this.annotations = anns;
        }
      })
    }
  }

  goToTime(event: MouseEvent) {
    let visualPosition = event.clientX - this.getTimelineRect().left;
    this.storeService.setCurrentTime(this.getTime(visualPosition));
  }

  goToNote(event: MouseEvent, note: BaseAnnotation) {
    this.storeService.setCurrentTime(note.time);
    if (note.type == NoteTool.TYPE) {
      this.am.setHighlightedNote(note.uuid);
      this.highlightedPoint = note.uuid;
    }
    event.stopPropagation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['highlightedNote']) {
      this.highlightedPoint = changes['highlightedNote'].currentValue;
    }
  }


  private getTime(p: number): number {
    return Math.round((p * this.storeService.getVideoDuration()) / this.getTimelineRect().width);
  }

  private getPosition(t: number): string {
    let pos = (t * 100) / this.storeService.getVideoDuration();
    if (pos >= 0 && pos <= 100) {
      return pos + '%';
    } else if (pos < 0) {
      return '0%'
    } else if (pos > 98) {
      return '98%';
    }
  }

  private getTimelineRect(): ClientRect {
    return this.timelineElem.nativeElement.getBoundingClientRect();
  }

  getItemPositionOnTimeline(item: any): string {
    if (item) {
      return this.getPosition(item.time);
    }
    return '0%';
  }

}
