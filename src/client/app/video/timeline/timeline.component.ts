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
    let timestamp = slide._id.toString().substring(0, 8)
    let date = new Date(parseInt(timestamp, 16) * 1000)
    sec = (date.getTime() - this.startDate) / 1000
    return this.percentageViewed(sec)

  }

  setTimeMarker(slide: Screenshot) {
    let sec = 0
    let timestamp = slide._id.toString().substring(0, 8)
    let date = new Date(parseInt(timestamp, 16) * 1000)
    sec = (date.getTime() - this.startDate) / 1000
    this.store.dispatch(new SetUpdatedTime(sec))
    this.viewedBar.nativeElement.style.width = this.percentageViewed(sec)
  }

  ngOnDestroy() {
    this.videoSubsc.unsubscribe()
    this.slideSubsc.unsubscribe()
    this.currentTimeSubsc.unsubscribe()
  }
}
