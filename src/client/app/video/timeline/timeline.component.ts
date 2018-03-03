import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { SetCurrentTime } from '../../store/video/video.actions'

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('viewedBar') viewedBar: ElementRef;

  totalTime: number
  currentTime: number

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.select(s => s.video.totalTime).subscribe(data => {
      this.totalTime = data
    })

    this.store.select(s => s.video.camVideo).subscribe(data => {
      if (data != null) {
        data.ontimeupdate = (event) => {
          this.currentTime = data.currentTime
          this.viewedBar.nativeElement.style.width = this.percentageViewed(data.currentTime)
        }
      }

    })
  }

  setTimeOnClick(event: MouseEvent) {

    let rect = this.progressBar.nativeElement.getBoundingClientRect()
    let newTime = ((event.clientX - rect.left) * this.totalTime) / (rect.right - rect.left)
    this.store.dispatch(new SetCurrentTime(newTime))
    this.viewedBar.nativeElement.style.width = this.percentageViewed(newTime)

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

}
