import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import * as LectureActions from './lecture.actions';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class LectureEffects {

  constructor(private actions$: Actions) {}
}
