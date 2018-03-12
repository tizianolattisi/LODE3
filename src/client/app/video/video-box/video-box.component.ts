import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'video-box',
  templateUrl: './video-box.component.html',
  styleUrls: ['./video-box.component.scss']
})
export class VideoBoxComponent implements OnInit {

  @Input('videoUrl') videoUrl: string;
  @Input('width') width: string;
  @Input('height') height: string;
  @Output() videoHtmlElement: EventEmitter<HTMLVideoElement> = new EventEmitter<HTMLVideoElement>();

  @ViewChild('videoElement') videoElement: ElementRef;

  public currentWidth: string

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.videoHtmlElement.emit(this.videoElement.nativeElement);

    this.store.select(s => s.video.playing).subscribe(data => {
      this.playPause(data);
    })

    this.store.select(s => s.video.volume).subscribe(data => {
      this.videoElement.nativeElement.muted = !data
    })

    this.store.select(s => s.video.speed).subscribe(data => {
      this.videoElement.nativeElement.playbackRate = data

    })

    this.store.select(s => s.video.updatedTime).subscribe(data => {
      this.videoElement.nativeElement.currentTime = data
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
}
