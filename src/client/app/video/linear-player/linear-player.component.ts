import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SetUpdatedTime } from '../../store/video/video.actions'

@Component({
  selector: 'linear-player',
  templateUrl: './linear-player.component.html',
  styleUrls: ['./linear-player.component.scss']
})

/*
  Componente con gli stream posizionati orizzontalmente
*/
export class LinearPlayerComponent implements OnInit, OnDestroy {

  camVideoUrl: Observable<string>
  pcVideoUrl: Observable<string>
  hasAnnotations: boolean
  hasCamVideo: boolean
  streamWidth: string

  private camVideoSubsc: Subscription
  private annotationsSubsc: Subscription

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // prendo i valori dallo store
    this.camVideoUrl = this.store.select(s => s.video.camUrl)
    this.pcVideoUrl = this.store.select(s => s.video.pcUrl)
    this.camVideoSubsc = this.camVideoUrl.subscribe(data => {
      this.hasCamVideo = (data !== '')
      this.calculateAspectRatio()
    })
    this.annotationsSubsc = this.store.select(s => s.video.hasAnnotations).subscribe(data => {
      this.hasAnnotations = data
      this.calculateAspectRatio()
    })
  }

  calculateAspectRatio() {
    const actualHeight = window.innerHeight - 220;
    const actualWidth = window.innerWidth;
    let width = this.hasAnnotations ? (this.hasCamVideo ? 33 : 49) : 49
    let height = Math.min(actualHeight, (actualWidth * (width / 100) * (9 / 16)))
    if (height === actualHeight) {
      this.streamWidth = (height * (16 / 9)) + 'px'
    } else {
      this.streamWidth = width + '%'
    }
  }

  onResize() {
    this.calculateAspectRatio()
  }

  ngOnDestroy() {

    let signalTimeSubs = this.store.select(s => s.video.currentTime).subscribe(data => {
      this.store.dispatch(new SetUpdatedTime(data))
    })
    signalTimeSubs.unsubscribe()
    this.annotationsSubsc.unsubscribe()
    this.camVideoSubsc.unsubscribe()
  }
}
