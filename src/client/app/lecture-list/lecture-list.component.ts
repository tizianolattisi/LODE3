import {Router} from '@angular/router';
import {Lecture} from '../service/model/lecture';
import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store/app-state';
import {LectureService} from '../service/lecture.service';

import * as Lectureactions from '../store/lecture/lecture.actions';

@Component({
  selector: 'l3-lecture-list',
  templateUrl: './lecture-list.component.html',
  styleUrls: ['./lecture-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LectureListComponent implements OnInit {

  liveLectures$: Observable<Lecture[]>;
  lectures$: Observable<Lecture[]>;

  pin = '';

  invalidPin = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private lectureService: LectureService,
    private cd: ChangeDetectorRef) {}

  ngOnInit() {

    this.store.dispatch(new Lectureactions.UpdateLectureList());

    this.liveLectures$ = this.store.select(s => s.lecture.liveLectures);
    this.lectures$ = this.store.select(s => s.lecture.lectures);
  }


  goToLiveLecture(lecture: Lecture) {
    // Check that pin is correct
    this.lectureService.verifyPin(lecture.uuid, this.pin)
      .subscribe(valid => {
        this.invalidPin = !valid;
        this.cd.detectChanges();

        if (!this.invalidPin) {
          // Save pin, current lecture and go to editor
          this.store.dispatch(new Lectureactions.SetCurrentPin(this.pin));
          this.store.dispatch(new Lectureactions.SetCurrentLecture(lecture));
          this.router.navigate(['editor', lecture.uuid]);
        }
      });
  }

  goToLecture(lecture: Lecture) {
    // Save current lecture
    this.store.dispatch(new Lectureactions.SetCurrentLecture(lecture));
    this.router.navigate(['editor', lecture.uuid]);
  }

}
