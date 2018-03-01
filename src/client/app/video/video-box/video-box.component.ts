import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'video-box',
  templateUrl: './video-box.component.html',
  styleUrls: ['./video-box.component.scss']
})
export class VideoBoxComponent implements OnInit {

  @Input('videoUrl') videoUrl: string;
  @ViewChild('videoElement') videoElement: ElementRef;

  play: Observable<boolean>

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.store.select(s => s.video.playing).subscribe(data => {
      console.log('data: ' + data + " typeof: " + typeof data)
      this.playPause(data);
    })
  }

  /*
     Avvia/ferma i due stream video in base al valore 'playing'
 */
  playPause(playing: boolean) {
    console.log("sono nella funzione del video-box")
    if (playing) {
      this.videoElement.nativeElement.play()
    } else {
      this.videoElement.nativeElement.pause()
    }
  }

}
