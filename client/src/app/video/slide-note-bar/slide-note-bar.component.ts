import {
  Component, OnInit, Directive, Input, ElementRef, ViewChild, ViewChildren, Output,
  QueryList, EventEmitter
} from '@angular/core';
import {StoreService} from "../../shared/store.service";
import {AnnotationManager} from "../../annotation/AnnotationManager";

@Directive({
  selector: '[slideIndex]'
})
export class SlideDirective {
  @Input() slideIndex: number;

  constructor(public el: ElementRef) {
  }
}

@Component({
  selector: 'slide-note-bar',
  templateUrl: './slide-note-bar.component.html',
  styleUrls: ['./slide-note-bar.component.scss']
})
export class SlideNoteBarComponent implements OnInit {


  @ViewChild('slidesBox') slidesBox: ElementRef;
  @ViewChild('notesBox') notesBox: ElementRef;
  @ViewChildren(SlideDirective) slidesElems: QueryList<SlideDirective>;

  @Output('highlightNoteRequest') highlightNoteRequest: EventEmitter<string> = new EventEmitter<string>();

  slides: any[];
  showSlides: boolean = true;

  public constructor(private storeService: StoreService, public am: AnnotationManager) {

    this.storeService.currentSlideIndex.subscribe(index => {
      if (this.slidesElems) {
        this.slidesElems.forEach(slide => {
          if (slide.slideIndex == index) {
            let pw = this.slidesBox.nativeElement.getBoundingClientRect().width / 2;
            let er = slide.el.nativeElement.getBoundingClientRect();
            this.animate(this.slidesBox.nativeElement, 'scrollLeft', this.slidesBox.nativeElement.scrollLeft,
              this.slidesBox.nativeElement.scrollLeft + er.left - pw + (er.width / 2), 500);
          }
        });
      }
    });

    this.am.highlightedNote.subscribe(uuid => {
      this.showSlides = false;

      let noteElem = document.getElementById('note-' + uuid);
      if (noteElem) {
        let ne = noteElem.getBoundingClientRect();
        let pw = this.notesBox.nativeElement.getBoundingClientRect().width / 2;
        this.animate(this.notesBox.nativeElement, 'scrollLeft', this.notesBox.nativeElement.scrollLeft,
          this.notesBox.nativeElement.scrollLeft + ne.left - pw + (ne.width / 2), 500)
      }
    });
  }

  ngOnInit(): void {

    this.storeService.lodeLecture.subscribe((lodeLecture)=> {
      if (lodeLecture) {
        this.slides = lodeLecture.slides;
      }
    });
  }

  goToSlide(slideIndex: number) {
    this.storeService.setCurrentSlideIndex(slideIndex);
  }

  newNote() {
    let note = this.am.newNote(this.storeService.getCurrentSlide());
    this.am.openNote(note.uuid, note.pageNumber, true);
  }

  highlightTimeline(data: {uuid: string, pageNumber: number}) {
    this.highlightNoteRequest.emit(data.uuid);
  }


  animate(elem: any, style: string, from: number, to: number, time: number) {
    if (!elem) return;
    var start = new Date().getTime(),
      timer = setInterval(function () {
        var step = Math.min(1, (new Date().getTime() - start) / time);
        elem[style] = (from + step * (to - from));
        if (step == 1) clearInterval(timer);
      }, 25);
  }
}
