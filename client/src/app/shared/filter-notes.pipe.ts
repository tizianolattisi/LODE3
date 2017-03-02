import { Pipe, PipeTransform } from '@angular/core';
import {BaseAnnotation} from "../annotation/model/BaseAnnotation";
import {NoteTool} from "../annotation/tools/NoteTool";

@Pipe({
  name: 'filterNotes', pure: false
})
export class FilterNotesPipe implements PipeTransform {

  transform(value: {[uuid: string]: BaseAnnotation}[], pageNumber?: number): BaseAnnotation[] {

    let result: BaseAnnotation[] = [];
    if (value) {
      if (pageNumber && pageNumber > 0) {
        this.addNotes(value[pageNumber], result);
      } else {
        for (let page of <{[uuid: string]: BaseAnnotation}[]>value) {
          if (page) {
            this.addNotes(page, result);
          }
        }
      }
    }
    return result;
  }

  private addNotes(value: {[uuid: string]: BaseAnnotation}, array: BaseAnnotation[]) {
    if (value) {
      for (let key of Object.keys(value)) {
        if (value[key] && value[key].type == NoteTool.TYPE) {
          array.push(value[key]);
        }
      }
    }
  }

}
