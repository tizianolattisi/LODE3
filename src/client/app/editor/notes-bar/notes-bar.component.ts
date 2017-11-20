import {Input, Component, ChangeDetectionStrategy} from '@angular/core';
import {Annotation} from '../../service/model/annotation';

@Component({
  selector: 'l3-notes-bar',
  templateUrl: './notes-bar.component.html',
  styleUrls: ['./notes-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesBarComponent {

  private _notes: Annotation[] = [];

  @Input() set annotations(notes: Annotation[]) {
    this._notes = notes ? notes.filter(note => note.type === 'note') : [];
  }

  get annotations() {
    return this._notes;
  }

}
