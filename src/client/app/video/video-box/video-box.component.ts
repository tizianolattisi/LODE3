import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { SetCurrentTime } from '../../store/video/video.actions'

@Component({
  selector: 'video-box',
  templateUrl: './video-box.component.html',
  styleUrls: ['./video-box.component.scss']
})
export class VideoBoxComponent implements OnInit {

  @Input('videoUrl') videoUrl: string;
  @ViewChild('videoElement') videoElement: ElementRef;

  currentTime: number

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.store.select(s => s.video.playing).subscribe(data => {
      this.playPause(data);
    })

    this.store.select(s => s.video.updatedTime).subscribe(data => {
      this.videoElement.nativeElement.currentTime = data;
    })

    this.store.select(s => s.video.volume).subscribe(data => {
      this.videoElement.nativeElement.muted = !data
    })

    this.store.select(s => s.video.speed).subscribe(data => {
      this.videoElement.nativeElement.playbackRate = data

    })
  }

  /*
     Avvia/ferma i due stream video in base al valore 'playing'
 */
  playPause(playing: boolean) {
    if (playing) {
      this.videoElement.nativeElement.play()
    } else {
      this.videoElement.nativeElement.pause()
    }
  }

  onTimeUpdate(value) {
    this.store.dispatch(new SetCurrentTime(this.videoElement.nativeElement.currentTime))
  }

}
