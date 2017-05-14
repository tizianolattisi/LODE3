import {Component, OnInit, Input} from '@angular/core';
import {StoreService} from "../../shared/store.service";
import {BaseAnnotation} from "../../annotation/model/BaseAnnotation";
import {NoteManager} from "../../annotation/NoteManager";
import {OpenNotes} from "../../annotation/OpenNotes";

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {


  @Input('noteId') noteUuid: string;
  @Input('notePage') notePage: number;
  @Input('openEditMode') openEditMode: boolean;
  @Input('highlightNote') highlightNote: boolean;

  isOpen: boolean = false;
  note: any;

  constructor(private nm: NoteManager, private openNotes: OpenNotes, public storeService: StoreService) {
    this.openNotes.openNotesUuid.subscribe(notes => {
      this.isOpen = notes.indexOf(this.noteUuid) >= 0;
    })
  }

  ngOnInit(): void {
    // get note
    this.note = this.nm.getNote(this.noteUuid, this.notePage);
  }

  openNote(uuid: string, pageNumber: number) {
    this.openNotes.openNote(uuid, pageNumber, this.openEditMode);
  }

  deleteNote(uuid: string, pageNumber: number) {
    this.nm.deleteNote(uuid, pageNumber);
  }

  seeVideo(note: BaseAnnotation) {
    this.storeService.setCurrentTime(note.time, true);
    this.openNote(note.uuid, note.pageNumber);
  }

}
