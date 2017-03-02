import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secToTime'
})
export class SecToTimePipe implements PipeTransform {

  transform(seconds: number): string {
    if (!seconds) {
      return '00:00';
    }
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds - (min * 60));
    return min + ':' + ((sec > 9) ? (sec) : ('0' + sec));
  }

}
