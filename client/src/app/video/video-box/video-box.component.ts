import {Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'video-box',
  templateUrl: './video-box.component.html'
})
export class VideoBoxComponent implements OnInit {


  @Input('videoUrl') videoUrl: string;
  @Output() videoHtmlElement: EventEmitter<HTMLVideoElement> = new EventEmitter<HTMLVideoElement>();

  @ViewChild('videoElement') videoElement: ElementRef;

  ngOnInit(): void {
    this.videoHtmlElement.emit(this.videoElement.nativeElement);
  }

  playPause() {
    if (!this.videoElement.nativeElement.paused) {
      this.videoElement.nativeElement.pause();
    } else {
      this.videoElement.nativeElement.play();
    }
  }

}
