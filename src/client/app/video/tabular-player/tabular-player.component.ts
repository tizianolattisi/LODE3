import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SetUpdatedTime, Play, Pause } from '../../store/video/video.actions'
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tabular-player',
  templateUrl: './tabular-player.component.html',
  styleUrls: ['./tabular-player.component.scss']
})
export class TabularPlayerComponent implements OnInit, OnDestroy {

  camVideoUrl: Observable<string>
  pcVideoUrl: Observable<string>
  hasAnnotations: boolean

  private annotationsSubsc: Subscription

  @ViewChild('mainView') mainView: ElementRef;
  @ViewChild('firstThumb') firstThumb: ElementRef;
  @ViewChild('secondThumb') secondThumb: ElementRef;


  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // prendo i valori dallo store
    this.camVideoUrl = this.store.select(s => s.video.camUrl)
    this.pcVideoUrl = this.store.select(s => s.video.pcUrl)
    this.annotationsSubsc = this.store.select(s => s.video.hasAnnotations).subscribe(data => {
      this.hasAnnotations = data
    })
  }

  ngOnDestroy() {
    let signalTimeSubs = this.store.select(s => s.video.currentTime).subscribe(data => {
      this.store.dispatch(new SetUpdatedTime(data))
    })

    let signalPlay = this.store.select(s => s.video.playing).subscribe(data => {
      if (data)
        this.store.dispatch(new Play())
      else
        this.store.dispatch(new Pause())
    })
    signalTimeSubs.unsubscribe()
    signalPlay.unsubscribe()
    this.annotationsSubsc.unsubscribe()
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