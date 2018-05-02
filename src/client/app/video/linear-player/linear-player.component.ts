import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SetUpdatedTime } from '../../store/video/video.actions'

@Component({
  selector: 'linear-player',
  templateUrl: './linear-player.component.html',
  styleUrls: ['./linear-player.component.scss']
})

/**
  Componente con gli stream posizionati orizzontalmente e di dimensione uguale
*/
export class LinearPlayerComponent implements OnInit, OnDestroy {

  camVideoUrl: Observable<string> // url dello stream della camera
  pcVideoUrl: Observable<string> // url dello stream del pc
  hasAnnotations: boolean // true se è necessario visualizzare lo stream delle annotazioni
  hasCamVideo: boolean // true se è necessario visualizzare lo stream della camera
  streamWidth: string // larghezza di un singolo stream
  hiddenHeader: boolean = false // true se l'header è collassato

  private camVideoSubsc: Subscription
  private annotationsSubsc: Subscription
  private headerSubsc: Subscription

  /**
   * Metodo costruttore
   * @param store store in cui vengono salvati i dati della sessione
   */
  constructor(
    private store: Store<AppState>
  ) { }

  /**
   * Setta gli url e calcola la dimensione corretta degli stream
   */
  ngOnInit() {
    // prendo i valori dallo store
    this.camVideoUrl = this.store.select(s => s.video.camUrl)
    this.pcVideoUrl = this.store.select(s => s.video.pcUrl)
    this.camVideoSubsc = this.camVideoUrl.subscribe(data => {
      this.hasCamVideo = (data !== '')
      this.calculateAspectRatio()
    })
    this.annotationsSubsc = this.store.select(s => s.video.hasAnnotations).subscribe(data => {
      this.hasAnnotations = data
      this.calculateAspectRatio()
    })
    this.headerSubsc = this.store.select(s => s.video.hiddenHeader).subscribe(data => {
      this.hiddenHeader = data
      this.calculateAspectRatio()
    })
  }

  /**
   * Calcola la dimensione corretta per gli stream video. 
   * Sfrutta più spazio possibile orizzontalmente facendo sempre apparire a schermo i controlli.
   */
  calculateAspectRatio() {
    let actualHeight = window.innerHeight - 205;
    if (this.hiddenHeader) {
      actualHeight += 60
    }
    const actualWidth = window.innerWidth;
    let width = this.hasAnnotations ? (this.hasCamVideo ? 33 : 49) : 49
    let height = Math.min(actualHeight, (actualWidth * (width / 100) * (9 / 16)))
    if (height === actualHeight) {
      this.streamWidth = (height * (16 / 9)) + 'px'
    } else {
      this.streamWidth = width + '%'
    }
  }

  /**
   * Ogni volta che la pagina subisce un resize aggiorno la dimensione degli stream
   */
  onResize() {
    this.calculateAspectRatio()
  }

  /**
   * Il componente si disiscrive da tutte le Subscription e aggiorna il currentTime
   */
  ngOnDestroy() {
    let signalTimeSubs = this.store.select(s => s.video.currentTime).subscribe(data => {
      this.store.dispatch(new SetUpdatedTime(data))
    })
    if (signalTimeSubs !== undefined)
      signalTimeSubs.unsubscribe()
    if (this.annotationsSubsc !== undefined)
      this.annotationsSubsc.unsubscribe()
    if (this.camVideoSubsc !== undefined)
      this.camVideoSubsc.unsubscribe()
    if (this.headerSubsc !== undefined)
      this.headerSubsc.unsubscribe()
  }
}
