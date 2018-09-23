import { ActivatedRoute } from '@angular/router';
import { ErrorResponse } from '../../service/model/error-response';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { passwordValidator } from '../password.validator';

import * as UserActions from '../../store/user/user.actions';

@Component({
  selector: 'l3-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;

  resetSuccess$: Observable<boolean>;
  loadingReset$: Observable<boolean>;
  errorReset$: Observable<ErrorResponse>;

  errMsgs = {
    400: 'Some fields are wrong or user does not exists. Please recheck fields.',
    500: 'Something goes wrong... please retry.',
  };

  private code = '';

  public constructor(private store: Store<AppState>, private fb: FormBuilder, private route: ActivatedRoute) {

    // init form group
    this.form = this.fb.group({
      'password': ['', [Validators.required, Validators.minLength(6), passwordValidator()]],
      'password_retype': ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {

    this.route.data.subscribe((data: { code: string }) => {
      this.code = data.code;
    });


    this.resetSuccess$ = this.store.select(s => s.user.successChangePasswordWithCode);
    this.loadingReset$ = this.store.select(s => s.user.loadingChangePasswordWithCode);
    this.errorReset$ = this.store.select(s => s.user.errorChangePasswordWithCode);
  }

  doReset(credentials: any) {

    // Check password matching
    if (credentials.password !== (credentials as any).password_retype) {

      this.form.controls['password'].setErrors({ 'passwordmismatch': 'Passwords does not match' });
      this.form.controls['password_retype'].setErrors({ 'passwordmismatch': 'Passwords does not match' });

    } else {
      this.store.dispatch(new UserActions.ChangePasswordWithCode({
        code: this.code,
        password: credentials.password
      }));
    }
  }
}
