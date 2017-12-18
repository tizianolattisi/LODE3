import {MatSnackBar} from '@angular/material/snack-bar';
import {of} from 'rxjs/observable/of';
import {AppState} from '../app-state';
import {LectureService} from '../../service/lecture.service';
import {Lecture} from '../../service/model/lecture';
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {Screenshot} from '../../service/model/screenshot';
import {ClearAnnotationWorkspace} from '../annotation/annotation.actions';
import {
  ActionTypes,
  FetchLecture,
  FetchUserScreenshots,
  GetScreenshot,
  SetCurrentLecture,
  SetUserScreenshots,
  UpdateLectureList,
  GetBlankPage,
} from './lecture.actions';

import * as LectureActions from './lecture.actions';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class LectureEffects {

  @Effect()
  updateLectureList$ = this.actions$.ofType<UpdateLectureList>(ActionTypes.UPDATE_LECTURE_LIST)
    .switchMap(payload => Observable.forkJoin([
      this.lectureService.getLectures(),
      this.lectureService.getLectures(true)])
      .map((lectures: Lecture[][]) => new LectureActions.SetLectureList({lectures: lectures[0], live: lectures[1]}))
      .catch(err => Observable.of(new LectureActions.UpdateLectureListError(err)))
    );

  @Effect()
  setCurrentLecture$ = this.actions$.ofType<SetCurrentLecture>(ActionTypes.SET_CURRENT_LECTURE)
    .map(a => a.payload)
    .switchMap(lecture => of(new ClearAnnotationWorkspace()));

  @Effect()
  fetchCurrentLecture$ = this.actions$.ofType<FetchLecture>(ActionTypes.FETCH_LECTURE)
    .map(a => a.payload)
    .switchMap(lectureId =>
      this.lectureService.getLecture(lectureId)
        .map((lecture: Lecture) => new LectureActions.SetCurrentLecture(lecture))
        .catch(err => Observable.of(new LectureActions.FetchLectureError(err)))
    );

  @Effect()
  fetchUserScreenshots$ = this.actions$.ofType<FetchUserScreenshots>(ActionTypes.FETCH_USER_SCREENSHOTS)
    .map(a => a.payload)
    .switchMap(lectureId =>
      this.lectureService.getUserScreenshots(lectureId)
        .map(screenshots => new LectureActions.SetUserScreenshots(screenshots))
        .catch(err => Observable.of(new LectureActions.FetchUserScreenshotsError(err)))
    );

  @Effect()
  fetchUserScreenshotsImgs$ = this.actions$.ofType<SetUserScreenshots>(ActionTypes.SET_USER_SCREENSHOTS)
    .map(a => a.payload)
    .withLatestFrom(this.store.select(s => s.lecture.currentLecture))
    .switchMap(([ss, lecture]) =>
      // Foreach screenshot download it and save base64
      Observable.forkJoin<Screenshot>(ss.map(screenshot => this.lectureService.getScreenshotImage(lecture.uuid, screenshot)))
        .map(updatedSS => updatedSS.length > 0 ?
          [new LectureActions.SetUserScreenshotsImg(updatedSS), new LectureActions.SetCurrentSlide(0)] :
          new LectureActions.SetUserScreenshotsImg(updatedSS)
        )
        .switchMap(actions => actions instanceof Array ? actions : of(actions))
        .catch(err => Observable.of(new LectureActions.FetchUserScreenshotsError(err))) // TODO different action
    );

  @Effect({dispatch: false})
  getScreenshot$ = this.actions$.ofType<GetScreenshot>(ActionTypes.GET_SCREENSHOT)
    .map(a => a.payload)
    .do(payload => {

      this.lectureService.getScreenshot(payload.lectureId, payload.pin).subscribe(s => {
        this.store.dispatch(new LectureActions.GetScreenshotComplete(s));
      }, err => {
        if (err && err.code === 'no-new-screenshot') {// No new screenshots available
          this.snackBar.open('This is the latest screenshot available!', null, {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
        this.store.dispatch(new LectureActions.SetScreenshotStatus('done'));
      });

    });

  @Effect({dispatch: false})
  getBlankPage$ = this.actions$.ofType<GetBlankPage>(ActionTypes.GET_BLANK_PAGE)
    .map(a => a.payload)
    .do(payload => {

      this.lectureService.getScreenshot(payload.lectureId, payload.pin, true).subscribe(s => {
        this.store.dispatch(new LectureActions.GetScreenshotComplete(s));
      }, err => {
        console.error('Error while getting blank page', err);
        this.store.dispatch(new LectureActions.SetScreenshotStatus('done'));
      });

    });


  constructor(
    private actions$: Actions,
    private lectureService: LectureService,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {}
}
