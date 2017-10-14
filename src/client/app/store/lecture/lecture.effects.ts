import {AppState} from '../app-state';
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
import 'rxjs/add/operator/withLatestFrom';
import {Action, Store} from '@ngrx/store';
import {Screenshot} from '../../service/model/screenshot';

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

  @Effect()
  fetchUserScreenshots$ = this.actions$.ofType(LectureActions.FETCH_USER_SCREENSHOTS)
    .map(toPayload)
    .switchMap(lectureId =>
      this.lectureService.getUserScreenshots(lectureId)
        .map(screenshots => new LectureActions.SetUserScreenshots(screenshots))
        .catch(err => Observable.of(new LectureActions.FetchUserScreenshotsError(err)))
    );

  @Effect()
  fetchUserScreenshotsImgs$ = this.actions$.ofType(LectureActions.SET_USER_SCREENSHOTS)
    .map<Action, Screenshot[]>(toPayload)
    .withLatestFrom(this.store.select(s => s.lecture.currentLecture))
    .switchMap(([ss, lecture]) =>

      // TODO lecture can be null

      // Foreach screenshot download it and save base64
      Observable.forkJoin<Screenshot>(ss.map(screenshot => this.lectureService.getScreenshotImage(lecture.uuid, screenshot)))
        .map(updatedSS => new LectureActions.SetUserScreenshotsImg(updatedSS))
        .catch(err => Observable.of(new LectureActions.FetchUserScreenshotsError(err))) // TODO different action
    );

  constructor(private actions$: Actions, private lectureService: LectureService, private store: Store<AppState>) {}
}
