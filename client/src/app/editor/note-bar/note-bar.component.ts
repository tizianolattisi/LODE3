import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NoteManager} from "../../annotation/NoteManager";
import {OpenNotes} from "../../annotation/OpenNotes";

@Component({
  selector: 'note-bar',
  templateUrl: './note-bar.component.html',
  styleUrls: ['./note-bar.component.scss']
})
export class NoteBarComponent {


  @Input('verticalPosition') verticalPosition: boolean;
  @Input('currentPage') currentPage: number;
  @Input('openInEditMode') openEditMode: boolean;

  @Output('noteClicked') noteClicked: EventEmitter<{uuid: string, pageNumber: number}> = new EventEmitter<{uuid: string, pageNumber: number}>();

  constructor(public nm: NoteManager, public openNotes:OpenNotes) {
  }

  openNote(uuid: string, pageNumber: number) {
    this.nm.openNote(uuid, pageNumber, this.openEditMode);
  }

  fireNoteClicked(uuid: string, pageNumber: number) {
    this.noteClicked.emit({uuid: uuid, pageNumber: pageNumber});
    this.nm.setHighlightedNote(uuid);
  }

}
