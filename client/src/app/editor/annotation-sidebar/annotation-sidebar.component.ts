import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AnnotationManager} from "../../annotation/AnnotationManager";
import {ToolService} from "../../annotation/tool.service";

@Component({
  selector: 'annotation-sidebar',
  templateUrl: './annotation-sidebar.component.html',
  styleUrls: ['./annotation-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationSidebarComponent {


  constructor(public am: AnnotationManager, private toolService: ToolService) {
  }

  selectAnnotation(uuid: string, pageNumber: number) {
    this.am.selectAnnotation(uuid, pageNumber);
  }

  deleteAnnotation(uuid: string, pageNumber: number): void {
    this.am.deleteAnnotation(uuid, pageNumber);
  }

  private isEmpty(obj: Object) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

}
