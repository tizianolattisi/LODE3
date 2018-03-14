import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Play, Pause, MuteAudio, UnmuteAudio, SetSpeed, SetUpdatedTime } from '../../store/video/video.actions'
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})

/*
  Componente che implementa i controlli video (play/stop, FF, FR, volume, speed)
*/
export class ControlsComponent implements OnInit, OnDestroy {

  play: boolean
  totalTime: number
  volume: boolean
  speed: number
  currentTime: number

  private videoSubscr: Subscription

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {

    this.videoSubscr = this.store.select(s => s.video).subscribe(data => {
      this.play = data.playing
      this.totalTime = data.totalTime
      this.volume = data.volume
      this.speed = data.speed
      this.currentTime = data.currentTime
    })

  }

  playPause() {
    if (this.play === false && this.currentTime < this.totalTime) {
      this.store.dispatch(new Play())
    } else {
      this.store.dispatch(new Pause())
    }
  }

  fastRewind() {
    let newTime = -10
    newTime += this.currentTime

    if (newTime < 0) {
      newTime = 0
    }
    this.store.dispatch(new SetUpdatedTime(newTime))

  }

  fastForward() {
    let newTime = 10
    newTime += this.currentTime

    if (newTime >= this.totalTime) {
      newTime = this.totalTime
      this.store.dispatch(new Pause())
    }

    this.store.dispatch(new SetUpdatedTime(newTime))


  }

  muteUnmute() {
    if (this.volume) {
      this.store.dispatch(new MuteAudio())
    } else {
      this.store.dispatch(new UnmuteAudio())
    }
  }

  setSpeed(value: number) {
    this.speed = value
    this.store.dispatch(new SetSpeed(value))
  }

  ngOnDestroy() {
    this.videoSubscr.unsubscribe()
  }
}
