import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Play, Pause, MuteAudio, UnmuteAudio, SetSpeed, SetUpdatedTime } from '../../store/video/video.actions'
import { Subscription } from 'rxjs/Subscription';
import { TrackerService } from '../../service/tracker.service';
import { Observable } from 'rxjs/Rx';

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
  private layoutSubscr: Subscription

  constructor(
    private store: Store<AppState>,
    private tracker: TrackerService
  ) { }

  ngOnInit() {

    this.videoSubscr = this.store.select(s => s.video).subscribe(data => {
      this.play = data.playing
      this.totalTime = data.totalTime
      this.volume = data.volume
      this.speed = data.speed
      this.currentTime = data.currentTime
    })

    this.layoutSubscr = this.store.select(s => s.video.videoLayout).subscribe(data => {
      this.tracker.trackEvent("layout", this.currentTime, data.toString());
    })

    Observable.interval(30000).subscribe(x => {
      this.tracker.trackEvent("alive", this.currentTime, new Date());
    });
  }

  playPause() {
    if (this.play === false && this.currentTime < this.totalTime) {
      this.store.dispatch(new Play())
      this.tracker.trackEvent("play", this.currentTime, Date.now());
    } else {
      this.store.dispatch(new Pause())
      this.tracker.trackEvent("pause", this.currentTime, Date.now());
    }
  }

  fastRewind() {
    let pastTime = this.currentTime
    let newTime = -10
    newTime += this.currentTime

    if (newTime < 0) {
      newTime = 0
    }
    this.tracker.trackEvent("jump", pastTime, newTime);
    this.store.dispatch(new SetUpdatedTime(newTime))

  }

  fastForward() {
    let newTime = 10
    let pastTime = this.currentTime
    newTime += this.currentTime

    if (newTime >= this.totalTime) {
      newTime = this.totalTime
      this.store.dispatch(new Pause())
    }
    this.tracker.trackEvent("jump", pastTime, newTime);
    this.store.dispatch(new SetUpdatedTime(newTime))


  }

  muteUnmute() {
    this.tracker.trackEvent("mute", this.currentTime, !this.volume && "off" || "on");
    if (this.volume) {
      this.store.dispatch(new MuteAudio())
    } else {
      this.store.dispatch(new UnmuteAudio())
    }
  }

  setSpeed(value: number) {
    this.tracker.trackEvent("speed", this.currentTime, value);
    this.speed = value
    this.store.dispatch(new SetSpeed(value))
  }

  ngOnDestroy() {
    this.videoSubscr.unsubscribe()
    this.layoutSubscr.unsubscribe()
  }
}
