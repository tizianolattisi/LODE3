import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {Annotation, NoteData} from '../../service/model/annotation';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app-state';
import {DeleteAnnotation, OpenNote} from '../../store/annotation/annotation.actions';

@Component({
  selector: 'l3-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {

  @Input()
  note: Annotation<NoteData>;

  constructor(private store: Store<AppState>) {}

  onDelete() {
    this.store.dispatch(new DeleteAnnotation({
      lectureId: this.note.lectureId,
      slideId: this.note.slideId,
      annotationId: this.note.uuid
    }));
  }

  onOpen() {
    this.store.dispatch(new OpenNote({slideId: this.note.slideId, annotationId: this.note.uuid}));
  }
}
