import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SetCurrentTime } from '../../store/video/video.actions'
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'video-box',
  templateUrl: './video-box.component.html',
  styleUrls: ['./video-box.component.scss']
})

/*
  Componente base dello stream video.
*/
export class VideoBoxComponent implements OnInit, OnDestroy {

  @Input('videoUrl') videoUrl: string; // url del video
  @Input('isMaster') isMaster: boolean = false; // se true il currentTime della sessione è relativo a questo componente
  @Input('allowFullscreen') allowFullscreen: boolean = true; // se true permette allo stream di essere fullscreen

  @ViewChild('videoElement') videoElement: ElementRef;

  private playing = false; // true se il video è in esecuzione
  loadingVideo = true // true se il video si sta caricando

  private playingSubsc: Subscription
  private volumeSubsc: Subscription
  private speedSubsc: Subscription
  private updateTimeSubsc: Subscription

  /**
   * Metodo costruttore
   * @param store store in cui vengono salvati i dati della sessione
   */
  constructor(
    private store: Store<AppState>
  ) { }

  /**
   * Estrae i dati dallo store
   */
  ngOnInit(): void {
    this.volumeSubsc = this.store.select(s => s.video.volume).subscribe(data => {
      this.videoElement.nativeElement.muted = !data
    })
    this.speedSubsc = this.store.select(s => s.video.speed).subscribe(data => {
      this.videoElement.nativeElement.playbackRate = data
    })
    // Caso time aggiornato da evento esterno
    this.updateTimeSubsc = this.store.select(s => s.video.updatedTime).subscribe(data => {
      this.videoElement.nativeElement.currentTime = data
    })
  }

  /**
    Avvia/ferma i due stream video in base al valore 'playing'.
 */
  playPause() {
    if (this.playing) {
      this.videoElement.nativeElement.play()
    } else {
      this.videoElement.nativeElement.pause()
    }
  }

  /**
    Se lo stream video è master, aggiorna il valore "currentTime" dello store.
  */
  setCurrentTime() {
    if (this.isMaster) {
      this.store.dispatch(new SetCurrentTime(this.videoElement.nativeElement.currentTime))
    }
  }

  /*
    Rende il video fullsceen
   */
  goFullscreen() {
    this.videoElement.nativeElement.webkitRequestFullScreen()
  }

  /**
   * Quando il video è stato caricato correttamente inizia ad ascoltare per azioni di tipo play/pause
   */
  startVideoListening() {
    this.loadingVideo = false
    this.videoElement.nativeElement.removeAttribute('controls')
    this.playingSubsc = this.store.select(s => s.video.playing).subscribe(data => {
      this.playing = data
      this.playPause();
    })
  }

  /**
   Quando viene distrutto il componente elimina tutte le subscription.
 */
  ngOnDestroy() {
    if (this.playingSubsc !== undefined)
      this.playingSubsc.unsubscribe()
    if (this.updateTimeSubsc !== undefined)
      this.updateTimeSubsc.unsubscribe()
    if (this.speedSubsc !== undefined)
      this.speedSubsc.unsubscribe()
    if (this.volumeSubsc !== undefined)
      this.volumeSubsc.unsubscribe()
  }
}
