import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { SetUpdatedTime } from '../../store/video/video.actions'

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('viewedBar') viewedBar: ElementRef;

  currentTime: number
  totalTime: number

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.select(s => s.video.totalTime).subscribe(data => {
      this.totalTime = data
    })

    this.store.select(s => s.video.currentTime).subscribe(data => {
      this.currentTime = data
      this.viewedBar.nativeElement.style.width = this.percentageViewed(data)
    })
  }

  setTimeOnClick(event: MouseEvent) {
    let rect = this.progressBar.nativeElement.getBoundingClientRect()
    let newTime = ((event.clientX - rect.left) * this.totalTime) / (rect.right - rect.left)
    this.store.dispatch(new SetUpdatedTime(newTime))
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
