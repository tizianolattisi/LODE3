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
  currentMainView: string = "pcVideo"
  playing: boolean

  private annotationsSubsc: Subscription
  private playingSubsc: Subscription

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

    this.playingSubsc = this.store.select(s => s.video.playing).subscribe(data => {
      this.playing = data
    })

    let thumb1 = this.firstThumb.nativeElement
    let thumb2 = this.secondThumb.nativeElement
    let main = this.mainView.nativeElement

    // setto come primo elemento dei container i video
    thumb1.insertBefore(thumb1.childNodes[1], thumb1.childNodes[0])
    thumb2.insertBefore(thumb2.childNodes[1], thumb2.childNodes[0])
    main.insertBefore(main.childNodes[1], main.childNodes[0])

  }

  ngOnDestroy() {
    let signalTimeSubs = this.store.select(s => s.video.currentTime).subscribe(data => {
      this.store.dispatch(new SetUpdatedTime(data))
    })

    signalTimeSubs.unsubscribe()
    this.annotationsSubsc.unsubscribe()
    this.playingSubsc.unsubscribe()
  }

  /*
    Cambia la mainView. nThumb indica l'indice del thumbnail con cui effettuare lo switch
  */
  changeThumb(nThumb: number) {
    let wasPlaying = this.playing
    this.store.dispatch(new Pause())

    var thumb
    if (nThumb === 1)
      thumb = this.firstThumb.nativeElement
    else
      thumb = this.secondThumb.nativeElement
    let main = this.mainView.nativeElement
    let smallElem = thumb.childNodes[0]
    let mainElem = main.childNodes[0]
    main.insertBefore(smallElem, main.childNodes[0])
    thumb.insertBefore(mainElem, thumb.childNodes[0])

    this.currentMainView = main.childNodes[0].id
    if (wasPlaying) {
      this.store.dispatch(new Play())
    }
  }

  rotateRight() {
    let wasPlaying = this.playing
    this.store.dispatch(new Pause())

    if (this.hasAnnotations) {
      let main = this.mainView.nativeElement
      let first = this.firstThumb.nativeElement
      let second = this.secondThumb.nativeElement

      let mainElem = main.childNodes[0]
      let firstElem = first.childNodes[0]
      let secondElem = second.childNodes[0]

      main.insertBefore(firstElem, main.childNodes[0])
      second.insertBefore(mainElem, second.childNodes[0])
      first.insertBefore(secondElem, first.childNodes[0])

      this.currentMainView = main.childNodes[0].id
    } else {
      this.changeThumb(1)
    }

    if (wasPlaying) {
      this.store.dispatch(new Play())
    }
  }
}