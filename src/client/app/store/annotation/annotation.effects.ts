import {AnnotationService} from '../../service/annotation.service';
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {ActionTypes, AddAnnotation, FetchAnnotations, DeleteAnnotation, EditAnnotation} from './annotation.actions';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class AnnotationEffects {

  @Effect({dispatch: false})
  fetchAnnotations$ = this.actions$.ofType<FetchAnnotations>(ActionTypes.FETCH_ANNOTATIONS)
    .map(a => a.payload)
    .do(payload => this.annotationService.fetchAnnotations(payload));

  @Effect({dispatch: false})
  addAnnotation$ = this.actions$.ofType<AddAnnotation>(ActionTypes.ADD_ANNOTATION)
    .map(a => a.payload)
    .do(payload => this.annotationService.addAnnotation(payload));

  @Effect({dispatch: false})
  editAnnotation$ = this.actions$.ofType<EditAnnotation>(ActionTypes.EDIT_ANNOTATION)
    .map(a => a.payload)
    .do(payload => this.annotationService.editAnnotation(payload));

  @Effect({dispatch: false})
  deleteAnnotation$ = this.actions$.ofType<DeleteAnnotation>(ActionTypes.DELETE_ANNOTATION)
    .map(a => a.payload)
    .do(payload => this.annotationService.deleteAnnotation({lectureId: payload.lectureId, uuid: payload.annotationId}));

  constructor(private actions$: Actions, private annotationService: AnnotationService) {}
}
