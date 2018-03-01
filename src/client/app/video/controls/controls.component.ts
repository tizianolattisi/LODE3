import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Play, Pause } from '../../store/video/video.actions'

@Component({
  selector: 'controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})

export class ControlsComponent implements OnInit {

  play: boolean

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.select(s => s.video.playing).subscribe(data => {
      this.play = data
    })
  }

  playPause() {
    console.log('invocato playPause del controller con valore: ' + this.play)
    if (this.play === false) {
      this.store.dispatch(new Play())
    } else {
      this.store.dispatch(new Pause())
    }
  }
}
