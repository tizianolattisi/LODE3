import {Lecture} from '../service/model/lecture';
import {FormControl} from '@angular/forms';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import * as Lectureactions from '../store/lecture/lecture.actions';

import {AppState} from '../store/app-state';

@Component({
  selector: 'l3-lecture-list',
  templateUrl: './lecture-list.component.html',
  styleUrls: ['./lecture-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LectureListComponent implements OnInit {

  liveLectures$: Observable<Lecture[]>;
  lectures$: Observable<Lecture[]>;

  pinForm = new FormControl();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {

    this.store.dispatch(new Lectureactions.UpdateLectureList());

    this.liveLectures$ = this.store.select(s => s.lecture.liveLectures);
    this.lectures$ = this.store.select(s => s.lecture.lectures);
  }


  goToLiveLecture(lecture) {
    console.log(lecture, this.pinForm.value);
  }

}
