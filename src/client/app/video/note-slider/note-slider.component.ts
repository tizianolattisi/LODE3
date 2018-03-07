import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { Observable } from 'rxjs/Observable';
import { SetCurrentTime } from '../../store/video/video.actions'
@Component({
  selector: 'note-slider',
  templateUrl: './note-slider.component.html',
  styleUrls: ['./note-slider.component.scss']
})
export class NoteSliderComponent implements OnInit {

  uuid$: Observable<string>
  slides$: Observable<Screenshot[]>
  startDate: number
  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit() {

    this.uuid$ = this.store.select(s => s.lecture.currentLecture.uuid)
    this.slides$ = this.store.select(s => s.lecture.slides)
    this.startDate = 20171129045450297000
  }

  setTime(slide: Screenshot) {

    this.store.dispatch(new SetCurrentTime(this.secondsDifference(slide.timestamp, this.startDate)))
  }

  private secondsDifference(timestamp1: number, timestamp2: number): number {
    timestamp1 /= 1000
    timestamp2 /= 1000

    let year1 = Math.floor(timestamp1 / 10000000000000)
    let year2 = Math.floor(timestamp2 / 10000000000000)
    timestamp1 = timestamp1 - year1 * 10000000000000
    timestamp2 = timestamp2 - year2 * 10000000000000

    let month1 = Math.floor(timestamp1 / 100000000000)
    let month2 = Math.floor(timestamp2 / 100000000000)
    timestamp1 = timestamp1 - month1 * 100000000000
    timestamp2 = timestamp2 - month2 * 100000000000
    if (year1 - year2 > 0)
      month1 += (year1 - year2) * 12

    let day1 = Math.floor(timestamp1 / 1000000000)
    let day2 = Math.floor(timestamp2 / 1000000000)
    timestamp1 = timestamp1 - day1 * 1000000000
    timestamp2 = timestamp2 - day2 * 1000000000
    if (month1 - month2 > 0)
      day1 += (month1 - month2) * 31

    let hour1 = Math.floor(timestamp1 / 10000000)
    let hour2 = Math.floor(timestamp2 / 10000000)
    timestamp1 = timestamp1 - hour1 * 10000000
    timestamp2 = timestamp2 - hour2 * 10000000
    if (day1 - day2 > 0)
      hour1 += (day1 - day1) * 24

    let minutes1 = Math.floor(timestamp1 / 100000)
    let minutes2 = Math.floor(timestamp2 / 100000)
    timestamp1 = timestamp1 - minutes1 * 100000
    timestamp2 = timestamp2 - minutes2 * 100000
    if (hour1 - hour2 > 0)
      minutes1 += (hour1 - hour2) * 60

    let seconds1 = Math.floor(timestamp1 / 1000)
    let seconds2 = Math.floor(timestamp2 / 1000)
    timestamp1 = timestamp1 - seconds1 * 1000
    timestamp2 = timestamp2 - seconds2 * 1000
    if (minutes1 - minutes2 > 0)
      seconds1 += (minutes1 - minutes2) * 60

    if (timestamp2 - timestamp1 < 0) {
      timestamp1 = (-(timestamp2 % -1000) + timestamp1 % 1000)
    } else {
      timestamp1 = timestamp1 - timestamp2
    }

    return (seconds1 - seconds2) + (timestamp1 / 1000)

  }
}
