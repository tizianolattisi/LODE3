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
  screenSize: string
  screenHeight: string

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
      this.screenSize = this.hasAnnotations ? (this.hasCamVideo ? '32vw' : '48vw') : ('48vw')
      this.screenHeight = this.hasAnnotations ? (this.hasCamVideo ? '21vw' : '30vw') : ('30vw')
    })
    this.annotationsSubsc = this.store.select(s => s.video.hasAnnotations).subscribe(data => {
      this.hasAnnotations = data
      this.screenSize = this.hasAnnotations ? (this.hasCamVideo ? '32vw' : '48vw') : ('48vw')
      this.screenHeight = this.hasAnnotations ? (this.hasCamVideo ? '21vw' : '30vw') : ('30vw')
    })
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
