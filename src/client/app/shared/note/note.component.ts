import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {Annotation, NoteData} from '../../service/model/annotation';

@Component({
  selector: 'l3-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {

  @Input()
  note: Annotation<NoteData>;

}
