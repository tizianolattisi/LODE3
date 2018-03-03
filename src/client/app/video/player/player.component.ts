import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as VideoActions from '../../store/video/video.actions'

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {

  camVideoUrl: Observable<string>
  pcVideoUrl: Observable<string>

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // prendo i valori dallo store
    this.camVideoUrl = this.store.select(s => s.video.camUrl)
    this.pcVideoUrl = this.store.select(s => s.video.pcUrl)
  }

  setCamVideo(htmlVideoElem: HTMLVideoElement) {
    this.store.dispatch(new VideoActions.SetCamVideo(htmlVideoElem))
  }

  setPcVideo(htmlVideoElem: HTMLVideoElement) {
    this.store.dispatch(new VideoActions.SetPcVideo(htmlVideoElem))
  }

}
