import {Component, ChangeDetectionStrategy, Input, SimpleChanges, ElementRef, ViewChild, Renderer2} from '@angular/core';
import {Annotation, NoteData} from '../../service/model/annotation';
import {OnChanges} from '@angular/core/src/metadata/lifecycle_hooks';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/app-state';
import {map, first} from 'rxjs/operators';
import {CloseNote, EditAnnotation} from '../../store/annotation/annotation.actions';

@Component({
  selector: 'l3-note-window',
  templateUrl: './note-window.component.html',
  styleUrls: ['./note-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteWindowComponent implements OnChanges {

  @ViewChild('window')
  windowElem: ElementRef;

  @Input()
  noteInfo: {slideId: string; annotationId: string};

  note: Annotation<NoteData>;
  expanded = false;

  saveTimer: any;


  constructor(private store: Store<AppState>, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.noteInfo) {
      this.store.select(s => s.annotation.annotations).pipe(
        first(),
        map(anns => anns[this.noteInfo.slideId]),
        map(anns => anns ? anns[this.noteInfo.annotationId] : null)
      ).subscribe(note => {
        this.note = note as Annotation<NoteData>;
      });
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

  onTitleChange(title: string) {
    this.clearTimeout();
    this.saveTimer = setTimeout(() => {
      this.saveNote(title, this.note.data.text);
    }, 5000);
  }

  onNoteChange(value: Changes) {
    this.clearTimeout();
    this.saveTimer = setTimeout(() => {
      this.saveNote(this.note.data.title, value.html);
    }, 3000);
  }

  private clearTimeout() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
  }

  private saveNote(title: string, text: string) {
    const note = {...this.note};
    note.data.text = text;
    note.data.title = title;
    this.store.dispatch(new EditAnnotation(note));
  }

}

interface Changes {
  editor: any;
  html: string;
  text: string;
  delta: string;
  oldDelta: string;
  source: string;
}
