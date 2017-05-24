import {Component} from '@angular/core';
import {StoreService} from "../../shared/store.service";
import {NoteTool} from "../../annotation/tools/NoteTool";
import {NoteManager} from "../../annotation/NoteManager";

@Component({
  selector: 'app-projector',
  templateUrl: './projector.component.html',
  styleUrls: ['./projector.component.scss']
})
export class ProjectorComponent {

  constructor(public storeService: StoreService, public nm: NoteManager) {

  }

  changeSlide(page: number) {
    this.storeService.setCurrentSlide(page);

    let note = this.nm.newNote(page);
    note.type = NoteTool.TYPE;
    note.data = "change-slide";
    this.nm.saveNote(note);
  }

}
