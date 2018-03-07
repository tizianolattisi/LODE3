import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as VideoActions from '../../store/video/video.actions'
@Component({
  selector: 'tabular-player',
  templateUrl: './tabular-player.component.html',
  styleUrls: ['./tabular-player.component.scss']
})
export class TabularPlayerComponent implements OnInit {

  camVideoUrl: Observable<string>
  pcVideoUrl: Observable<string>

  @ViewChild('mainView') mainView: ElementRef;
  @ViewChild('firstThumb') firstThumb: ElementRef;
  @ViewChild('secondThumb') secondThumb: ElementRef;

  @ViewChild('pcVideo') pcVideo: ElementRef;
  @ViewChild('camVideo') camVideo: ElementRef;
  @ViewChild('notes') notes: ElementRef;


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

  changeFirstThumb() {
    /*
    Da implementare
    */
  }

  changeSecondThumb() {
    /*
     Da implementare
     */
  }

}