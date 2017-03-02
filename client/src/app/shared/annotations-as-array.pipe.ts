import { Pipe, PipeTransform } from '@angular/core';
import {BaseAnnotation} from "../annotation/model/BaseAnnotation";

@Pipe({
  name: 'annotationsAsArray', pure: false
})
export class AnnotationsAsArrayPipe implements PipeTransform {

  transform(value: {[uuid: string]: BaseAnnotation}[]): BaseAnnotation[] {
    let result: BaseAnnotation[] = [];
    if (value) {
      for (let page of value) {
        if (page) {
          for (let key of Object.keys(page)) {
            result.push(page[key]);
          }
        }
      }
    }

    return result;
  }
}
