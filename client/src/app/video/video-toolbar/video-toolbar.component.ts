import {Component, Input} from '@angular/core';

@Component({
  selector: 'video-toolbar',
  templateUrl: './video-toolbar.component.html'
})
export class VideoToolbarComponent {

  @Input('htmlVideoElement') htmlVideoElement: HTMLVideoElement;

  RATE_VALUES = [
    {value: 1.0, name: '1.0x'},
    {value: 1.3, name: '1.3x'},
    {value: 1.5, name: '1.5x'},
    {value: 2.0, name: '2.0x'}
  ];

  playPause() {

    if (this.htmlVideoElement) {
      if (!this.htmlVideoElement.paused) {
        this.htmlVideoElement.pause();
      } else {
        this.htmlVideoElement.play();
      }
    }
  }

  fullscreen() {
    if (this.htmlVideoElement) {
      if (this.htmlVideoElement.requestFullscreen) {
        this.htmlVideoElement.requestFullscreen();
      } else if (this.htmlVideoElement.webkitRequestFullscreen) {
        this.htmlVideoElement.webkitRequestFullscreen();
      } else if ((<any>this.htmlVideoElement).mozRequestFullScreen) {
        (<any>this.htmlVideoElement).mozRequestFullScreen();
      } else if ((<any>this.htmlVideoElement).msRequestFullscreen) {
        (<any>this.htmlVideoElement).msRequestFullscreen();
      }
    }
  }

  mute() {
    if (this.htmlVideoElement) {
      this.htmlVideoElement.muted = !this.htmlVideoElement.muted;
    }
  }
}
