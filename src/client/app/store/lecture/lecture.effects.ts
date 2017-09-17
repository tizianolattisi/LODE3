import {LectureService} from '../../service/lecture.service';
import {Lecture} from '../../service/model/lecture';
import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';

import * as LectureActions from './lecture.actions';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LectureEffects {

  @Effect()
  updateLectureList$ = this.actions$.ofType(LectureActions.UPDATE_LECTURE_LIST)
    .switchMap(payload => Observable.forkJoin([
      this.lectureService.getLectures(),
      this.lectureService.getLectures(true)])
      .map((lectures: Lecture[][]) => new LectureActions.SetLectureList({lectures: lectures[0], live: lectures[1]}))
      .catch(err => Observable.of(new LectureActions.UpdateLectureListError(err)))
    );

  @Effect()
  fetchCurrentLecture$ = this.actions$.ofType(LectureActions.FETCH_LECTURE)
    .map(toPayload)
    .switchMap(lectureId =>
      this.lectureService.getLecture(lectureId)
        .map((lecture: Lecture) => new LectureActions.SetCurrentLecture(lecture))
        .catch(err => Observable.of(new LectureActions.FetchLectureError(err)))
    );

  constructor(private actions$: Actions, private lectureService: LectureService) {}
}
