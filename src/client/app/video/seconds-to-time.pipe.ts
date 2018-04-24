import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secondsToTime',
    pure: true
})

/**
 * Pipe che trasforma valori da secondi a stringhe nel formato HH:MM:SS
 */
export class SecondsToTimePipe implements PipeTransform {

    transform(value: number): string {
        let hours = Math.floor(value / 3600);
        let minutes = Math.floor((value % 3600) / 60);
        var seconds = Math.floor((value % 3600) % 60);
        let res = ''
        if (hours > 0) {
            res += ((hours > 9) ? hours : ('0' + hours)) + ':'
        }
        if (minutes > 0) {
            res += ((minutes > 9) ? minutes : ('0' + minutes)) + ':'
        } else {
            res += '00:'
        }
        if (seconds > 0) {
            res += (seconds > 9) ? seconds : ('0' + seconds)
        } else {
            res += '00'
        }
        return res
    }

}
