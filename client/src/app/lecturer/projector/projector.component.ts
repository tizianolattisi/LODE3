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
    this.am.saveNewAnnotation('change-slide', page, {pageNumber: page, annotationData: {page: page}, canvasAnnotation: null});
  }

}
