import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../store/app-state';
import {SetCurrentSlide} from '../../store/lecture/lecture.actions';
import {Screenshot} from '../../service/model/screenshot';

@Component({
  selector: 'l3-lateral-bar-slides',
  templateUrl: './lateral-bar-slides.component.html',
  styleUrls: ['./lateral-bar-slides.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateralBarSlidesComponent implements OnInit {

  slides$: Observable<Screenshot[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.slides$ = this.store.select(s => s.lecture.slides);
  }

  onSelect(slideIndex: number) {
    this.store.dispatch(new SetCurrentSlide(slideIndex));
  }
}
