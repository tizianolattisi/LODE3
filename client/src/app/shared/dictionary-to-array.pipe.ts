import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dictionaryToArray', pure: false
})
export class DictionaryToArrayPipe implements PipeTransform {

  transform(value: {[key: string]: any}[]): any[] {
    return Object.keys(value).map(key => value[key]);
  }

}
