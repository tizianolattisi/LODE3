import {Component} from '@angular/core';
import {StoreService} from "../../shared/store.service";

@Component({
  selector: 'app-projector',
  templateUrl: './projector.component.html',
  styleUrls: ['./projector.component.css']
})
export class ProjectorComponent {

  constructor(public storeService: StoreService) {

  }

  changeSlide(page: number) {
    this.storeService.setCurrentSlide(page);
    // TODO: notify via socket.io
  }

}
