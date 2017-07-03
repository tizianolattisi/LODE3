import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import * as ToolActions from './tool.actions';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ToolEffects {

  constructor(private actions$: Actions) {}
}
