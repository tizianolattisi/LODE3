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

/**
  Componente che implementa i controlli video (play/stop, FF, FR, volume, speed)
*/
export class ControlsComponent implements OnInit, OnDestroy {

  play: boolean // true se gli stream sono in esecuzione
  totalTime: number // lunghezza degli stream
  volume: boolean // true se il volume è attivato
  speed: number // velocità di riproduzione degli stream
  currentTime: number // tempo attuale

  private videoSubscr: Subscription
  private layoutSubscr: Subscription

  /**
   * Metodo costruttore
   * @param store store in cui vengono salvati i dati della sessione
   * @param tracker service utilizzato per i log
   */
  constructor(
    private store: Store<AppState>,
    private tracker: TrackerService
  ) { }

  /**
   * Setta i parametri iniziali dei controlli (playing, totalTime, volume, speed, currentTime)
   *  in base ai valori dello store.
   * Setta un timeout di 300s per il log di tipo "alive"
   */
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
    Observable.interval(300000).subscribe(x => {
      this.tracker.trackEvent("alive", this.currentTime, new Date());
    });
  }

  /**
   * Se il video è attualmente in esecuzione viene fermato, altrimenti viene eseguito.
   */
  playPause() {
    if (this.play === false && this.currentTime < this.totalTime) {
      this.store.dispatch(new Play())
      this.tracker.trackEvent("play", this.currentTime, Date.now());
    } else {
      this.store.dispatch(new Pause())
      this.tracker.trackEvent("pause", this.currentTime, Date.now());
    }
  }

  /**
   * Porta indietro di 10s il currentTime. Se il currentTime è < 10 viene settato a 0
   */
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

  /**
   * Porta in avanti di 10s il currentTime. Se il currentTime aggiornato sfora la durata del video,
   * il currentTime viene settato a totalTime e il video viene fermato.
   */
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

  /**
   * Se l'audio è attivo viene disattivato, altrimenti viene riattivato.
   */
  muteUnmute() {
    this.tracker.trackEvent("mute", this.currentTime, !this.volume && "off" || "on");
    if (this.volume) {
      this.store.dispatch(new MuteAudio())
    } else {
      this.store.dispatch(new UnmuteAudio())
    }
  }

  /**
   * Setta la velocità degli stream video
   * @param value nuova velocità degli stream
   */
  setSpeed(value: number) {
    this.tracker.trackEvent("speed", this.currentTime, value);
    this.speed = value
    this.store.dispatch(new SetSpeed(value))
  }

  /**
   * Il componente si disiscrive da tutte le Subscription
   */
  ngOnDestroy() {
    if (this.videoSubscr !== undefined)
      this.videoSubscr.unsubscribe()
    if (this.layoutSubscr !== undefined)
      this.layoutSubscr.unsubscribe()
  }
}
