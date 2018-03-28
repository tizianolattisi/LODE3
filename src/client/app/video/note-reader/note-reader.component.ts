import { Component, SimpleChanges, Renderer2, ViewChild, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/store/app-state';
import { CloseNote } from '../../store/annotation/annotation.actions';
import { Annotation, NoteData } from '../../service/model/annotation';

@Component({
  selector: 'note-reader',
  templateUrl: './note-reader.component.html',
  styleUrls: ['./note-reader.component.scss']
})
export class NoteReaderComponent implements OnInit, OnChanges {

  expanded = false;
  note: Annotation<NoteData>;


  @ViewChild('window') windowElem: ElementRef;
  @Input() noteInfo: { slideId: string; annotationId: string };

  constructor(private store: Store<AppState>, private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("chiamato changes")
    if (this.noteInfo) {
      this.store.select(s => s.video.allAnnotations).subscribe(data => {
        let actual = data.get(this.noteInfo.slideId)
        for (let x of actual) {
          if (x.uuid === this.noteInfo.annotationId) {
            let test = x as Annotation<NoteData>
            this.note = x as Annotation<NoteData>
            console.log("ho trovato: " + test.data.text)
            break
          }
        }
      })

    }
  }


  onExpand() {
    if (this.expanded) {
      this.renderer.removeClass(this.windowElem.nativeElement, 'expanded');
    } else {
      this.renderer.addClass(this.windowElem.nativeElement, 'expanded');
    }
    this.expanded = !this.expanded;
  }

  onClose() {
    this.store.dispatch(new CloseNote(this.noteInfo));
  }

}
