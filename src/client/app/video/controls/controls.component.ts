import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Play, Pause, SetUpdatedTime, MuteAudio, UnmuteAudio, SetSpeed } from '../../store/video/video.actions'

@Component({
  selector: 'controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})

export class ControlsComponent implements OnInit {

  play: boolean
  currentTime: number
  totalTime: number
  volume: boolean
  speed: number

  constructor(
    private store: Store<AppState>

  ) { }

  ngOnInit() {

    this.store.select(s => s.video).subscribe(data => {
      this.play = data.playing
      this.currentTime = data.currentTime
      this.totalTime = data.totalTime
      this.volume = data.volume
      this.speed = data.speed
    })

  }

  playPause() {
    if (this.play === false) {
      this.store.dispatch(new Play())
    } else {
      this.store.dispatch(new Pause())
    }
  }

  fastRewind() {
    let newTime = this.currentTime - 10
    if (newTime < 0) {
      newTime = 0
    }
    this.store.dispatch(new SetUpdatedTime(newTime))
  }

  fastForward() {

    let newTime = this.currentTime + 10
    if (newTime > this.totalTime) {
      newTime = this.totalTime
      this.store.dispatch(new Pause())
    }

    this.store.dispatch(new SetUpdatedTime(newTime))
  }

  muteUnmute() {
    if (this.volume) {
      this.store.dispatch(new MuteAudio)
    } else {
      this.store.dispatch(new UnmuteAudio)
    }
  }

  setSpeed(value: number) {
    this.speed = value
    this.store.dispatch(new SetSpeed(value))
  }
}
