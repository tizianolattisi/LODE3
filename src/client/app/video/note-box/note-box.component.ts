import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Screenshot } from '../../service/model/screenshot';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'note-box',
  templateUrl: './note-box.component.html',
  styleUrls: ['./note-box.component.scss']
})
export class NoteBoxComponent implements OnInit {

  slides$: Observable<Screenshot[]>
  currentSlide: Screenshot
  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {

    this.slides$ = this.store.select(s => s.lecture.slides)
    this.slides$.subscribe(data => {
      this.currentSlide = data[0]
    })
  }

}
