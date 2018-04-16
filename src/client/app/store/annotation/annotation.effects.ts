import {AnnotationService} from '../../service/annotation.service';
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {AppState} from '../app-state';
import {DataType, Annotation} from '../../service/model/annotation';
import {ActionTypes, AddAnnotation, FetchAnnotations, DeleteAnnotation, EditAnnotation, DeleteSelection} from './annotation.actions';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
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

  @Effect({dispatch: false})
  deleteSelection$ = this.actions$.ofType<DeleteSelection>(ActionTypes.DELETE_SELECTION)
    .do(payload => {
      this.store.select(s => s.annotation.selectedAnnotations)
        .first()
        .withLatestFrom(this.store.select(s => s.annotation.annotations))
        .subscribe(([selection, annotations]) => {
          selection.forEach(annotationId => {
            const ann = findAnnotation(annotations, annotationId);
            if (ann) {
              this.store.dispatch(new DeleteAnnotation({lectureId: ann.lectureId, slideId: ann.slideId, annotationId: ann.uuid}));
            }
          });
        });
    });

  constructor(private actions$: Actions, private store: Store<AppState>, private annotationService: AnnotationService) {}
}

function findAnnotation(annotations: {[slideId: string]: {[uuid: string]: Annotation<DataType>}}, uuid: string): Annotation<DataType> {
  for (const anns of Object.keys(annotations)) {
    if (annotations[anns][uuid]) {
      return annotations[anns][uuid];
    }
  }
  return null;
}
