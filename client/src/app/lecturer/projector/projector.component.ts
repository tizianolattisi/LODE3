import {Component} from '@angular/core';
import {StoreService} from "../../shared/store.service";
import {AnnotationManager} from "../../annotation/AnnotationManager";
import {NoteTool} from "../../annotation/tools/NoteTool";

@Component({
  selector: 'app-projector',
  templateUrl: './projector.component.html',
  styleUrls: ['./projector.component.scss']
})
export class ProjectorComponent {

  constructor(public storeService: StoreService, public am: AnnotationManager) {

  }

  changeSlide(page: number) {
    this.storeService.setCurrentSlide(page);

    var note = this.am.newNote(page);
    note.type = NoteTool.TYPE;
    note.data = "change-slide";
    this.am.saveNote(note);
  }

}
