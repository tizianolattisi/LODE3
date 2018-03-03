import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'note-slider',
  templateUrl: './note-slider.component.html',
  styleUrls: ['./note-slider.component.scss']
})
export class NoteSliderComponent implements OnInit {

  uuid$: Observable<string>
  slides$: Observable<Screenshot[]>

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit() {

    this.uuid$ = this.store.select(s => s.lecture.currentLecture.uuid)
    this.slides$ = this.store.select(s => s.lecture.slides)

  }

}
