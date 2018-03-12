import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as VideoActions from '../../store/video/video.actions'

@Component({
  selector: 'linear-player',
  templateUrl: './linear-player.component.html',
  styleUrls: ['./linear-player.component.scss']
})

export class LinearPlayerComponent implements OnInit {

  camVideoUrl: Observable<string>
  pcVideoUrl: Observable<string>
  hasAnnotations: boolean
  hasCamVideo: boolean
  screenSize: string
  screenHeight: string

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // prendo i valori dallo store
    this.camVideoUrl = this.store.select(s => s.video.camUrl)
    this.pcVideoUrl = this.store.select(s => s.video.pcUrl)
    this.camVideoUrl.subscribe(data => {
      this.hasCamVideo = (data !== '')
      this.screenSize = this.hasAnnotations ? (this.hasCamVideo ? '32vw' : '48vw') : (this.hasCamVideo ? '48vw' : 'auto')
      this.screenHeight = this.hasAnnotations ? (this.hasCamVideo ? '18vw' : '27vw') : (this.hasCamVideo ? '27vw' : '32vw')
    })
    this.store.select(s => s.video.hasAnnotations).subscribe(data => {
      this.hasAnnotations = data
      this.screenSize = this.hasAnnotations ? (this.hasCamVideo ? '32vw' : '48vw') : (this.hasCamVideo ? '48vw' : 'auto')
      this.screenHeight = this.hasAnnotations ? (this.hasCamVideo ? '18vw' : '27vw') : (this.hasCamVideo ? '27vw' : '32vw')
    })

  }


  setPcVideo(htmlVideoElem: HTMLVideoElement) {
    this.store.dispatch(new VideoActions.SetPcVideo(htmlVideoElem))
  }

}
