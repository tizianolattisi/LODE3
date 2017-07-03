import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import * as VideoActions from './video.actions';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class VideoEffects {

  constructor(private actions$: Actions) {}
}
