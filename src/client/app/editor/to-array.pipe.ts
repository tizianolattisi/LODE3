import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toArray',
  pure: true
})
export class ToArrayPipe implements PipeTransform {

  transform(value: {[key: string]: any}, args?: any): any {
    return Object.keys(value).map(k => value[k]);
  }

}
