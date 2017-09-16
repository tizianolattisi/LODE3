import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ErrorResponse } from '../../service/model/error-response';
import { AppState } from '../../store/app-state';
import * as UserActions from '../../store/user/user.actions';

@Component({
  selector: 'l3-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {

  success$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit() {

    this.success$ = this.store.select(s => s.user.successConfirmAccount);
    this.loading$ = this.store.select(s => s.user.loadingConfirmAccount);
    this.error$ = this.store.select(s => s.user.errorConfirmAccount);

    this.route.data
      .subscribe((data: {code: string}) => {
        const code = data.code;
        this.store.dispatch(new UserActions.ConfirmAccount(code));
      });
  }

}
