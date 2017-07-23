import {Lecture} from '../../model/lecture';
import {map} from 'rxjs/operator/map';
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {LectureService} from '../../lecture.service';
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

  constructor(private actions$: Actions, private lectureService: LectureService) {}
}
