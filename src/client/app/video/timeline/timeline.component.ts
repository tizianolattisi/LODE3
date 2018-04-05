import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { SetUpdatedTime, Play, Pause } from '../../store/video/video.actions'
import { Screenshot } from '../../service/model/screenshot';
// import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TrackerService } from '../../service/tracker.service';

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
  slides: Screenshot[]
  startDate: number
  hasAnnotations: boolean
  currentSlide: Screenshot
  private timeDrag: boolean = false
  private playing: boolean
  private jumpFrom: number = 0

  private currentSlideSubsc: Subscription
  private videoSubsc: Subscription
  private currentTimeSubsc: Subscription
  private startDateSubsc: Subscription
  private slidesSubsc: Subscription


  private playingWhileChange: boolean

  constructor(
    private store: Store<AppState>,
    private tracker: TrackerService) {
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

    this.slidesSubsc = this.store.select(s => s.lecture.slides).subscribe(data => {
      this.slides = data
    })
    this.startDateSubsc = this.store.select(s => s.video.startTimestamp).subscribe(data => {
      this.startDate = data
    })

    this.currentSlideSubsc = this.store.select(s => s.lecture.currentSlideIndex).subscribe(data => {
      if (this.slides !== undefined) {
        this.currentSlide = this.slides[data]
      }
    })
  }

  timebarMouseDown(event: MouseEvent) {
    this.jumpFrom = this.currentTime
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
      this.tracker.trackEvent("jump", this.jumpFrom, newTime);
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
    this.startDateSubsc.unsubscribe()
    this.currentTimeSubsc.unsubscribe()
    this.currentSlideSubsc.unsubscribe()
    this.slidesSubsc.unsubscribe()
  }
}
