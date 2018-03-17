import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { SetUpdatedTime, Play, Pause } from '../../store/video/video.actions'
import { Screenshot } from '../../service/model/screenshot';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit, OnDestroy {

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('viewedBar') viewedBar: ElementRef;

  totalTime: number
  currentTime: number
  slides$: Observable<Screenshot[]>
  startDate: number
  hasAnnotations: boolean

  private videoSubsc: Subscription
  private currentTimeSubsc: Subscription
  private slideSubsc: Subscription
  private timeDrag: boolean = false
  private playing: boolean

  private playingWhileChange: boolean

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit() {
    this.videoSubsc = this.store.select(s => s.video).subscribe(data => {
      this.totalTime = data.totalTime
      this.hasAnnotations = data.hasAnnotations
      this.startDate = data.startTimestamp
      this.playing = data.playing
    })

    this.currentTimeSubsc = this.store.select(s => s.video.currentTime).subscribe(data => {
      this.currentTime = data
      this.viewedBar.nativeElement.style.width = this.percentageViewed(data)
    })

    this.slides$ = this.store.select(s => s.lecture.slides)
    this.slideSubsc = this.store.select(s => s.video.startTimestamp).subscribe(data => {
      this.startDate = data
    })
  }

  timebarMouseDown(event: MouseEvent) {
    this.timeDrag = true;
    this.playingWhileChange = this.playing
    this.store.dispatch(new Pause())
    this.updateBar(event);

  }

  timebarMouseMove(event: MouseEvent) {
    if (this.timeDrag) {
      this.updateBar(event);
    }
  }

  timebarMouseUp(event: MouseEvent) {
    if (this.timeDrag) {
      this.timeDrag = false;
      let newTime = this.updateBar(event);
      this.store.dispatch(new SetUpdatedTime(newTime))
      if (this.playingWhileChange)
        this.store.dispatch(new Play())
    }
  }

  private updateBar(event: MouseEvent): number {
    let rect = this.progressBar.nativeElement.getBoundingClientRect()
    let newTime = ((event.clientX - rect.left) * this.totalTime) / (rect.right - rect.left)
    this.currentTime = newTime
    this.viewedBar.nativeElement.style.width = this.percentageViewed(newTime)
    return newTime
  }

  private percentageViewed(sec: number): string {
    let percentage = (sec * 100) / this.totalTime
    if (percentage < 0) {
      return '0%'
    } else if (percentage > 100) {
      return '100%'
    } else {
      return percentage + '%'
    }
  }

  markerPosition(slide: Screenshot): string {
    let sec = 0
    if (slide.timestamp > this.startDate)
      sec = this.secondsDifference(slide.timestamp, this.startDate)
    return this.percentageViewed(sec)

  }

  setTimeMarker(slide: Screenshot) {
    let sec = 0
    if (slide.timestamp > this.startDate)
      sec = this.secondsDifference(slide.timestamp, this.startDate)
    this.store.dispatch(new SetUpdatedTime(sec))
    this.viewedBar.nativeElement.style.width = this.percentageViewed(sec)
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

  ngOnDestroy() {
    this.videoSubsc.unsubscribe()
    this.slideSubsc.unsubscribe()
    this.currentTimeSubsc.unsubscribe()
  }
}
