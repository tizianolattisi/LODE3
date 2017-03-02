import {Component, OnInit, Input} from '@angular/core';
import {AnnotationManager} from "../../annotation/AnnotationManager";
import {StoreService} from "../../shared/store.service";
import {BaseAnnotation} from "../../annotation/model/BaseAnnotation";

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {


  @Input('noteId') noteUuid: string;
  @Input('notePage') notePage: number;
  @Input('openEditMode') openEditMode: boolean;
  @Input('highlightNote') highlightNote: boolean;

  isOpen: boolean = false;
  note: any;

  constructor(private am: AnnotationManager, public storeService: StoreService) {
    this.am.openNotesUuid.subscribe(notes => {
      this.isOpen = notes.indexOf(this.noteUuid) >= 0;
    })
  }

  ngOnInit(): void {
    // get note
    this.note = this.am.getNote(this.noteUuid, this.notePage);
  }

  openNote(uuid: string, pageNumber: number) {
    this.am.openNote(uuid, pageNumber, this.openEditMode);
  }

  deleteNote(uuid: string, pageNumber: number) {
    this.am.deleteNote(uuid, pageNumber);
  }

  seeVideo(note: BaseAnnotation) {
    this.storeService.setCurrentTime(note.time, true);
    this.openNote(note.uuid, note.pageNumber);
  }

}
