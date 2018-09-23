import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { ErrorResponse } from '../../service/model/error-response';
import { Credentials } from '../../service/model/credentials';
import { AppState } from '../../store/app-state';

import * as UserActions from '../../store/user/user.actions';
import { emailValidator } from '../email.validator';

@Component({
  selector: 'l3-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  private loginSubscription: Subscription;
  loadingLogin$: Observable<boolean>;
  errorLogin$: Observable<ErrorResponse>;

  passwordForgotSuccess$: Observable<boolean>;
  loadingPasswordForgot$: Observable<boolean>;
  errorPasswordForgot$: Observable<ErrorResponse>;

  newConfirmationCodeSuccess$: Observable<boolean>;
  loadingNewConfirmationCode$: Observable<boolean>;
  errorNewConfirmationCode$: Observable<ErrorResponse>;

  public currentPage = 0; // 0: login, 1: password forgot, 2: confirm email

  private defaultMsg = 'Something goes wrong... please retry.';
  loginErrMsgs = {
    400: 'Oops! Warning: No match for E-Mail Address and/or Password.',
    401: 'Oops! Warning: No match for E-Mail Address and/or Password.',
    404: 'Oops! Warning: No match for E-Mail Address and/or Password.',
    500: this.defaultMsg,
  };

  public constructor(private store: Store<AppState>, private fb: FormBuilder, private router: Router) {

    // init form group
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, emailValidator()]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {

    this.loginSubscription = this.store.select(s => s.user.token).subscribe(token => {
      if (token) { // redirect if user is already logged or just logged
        this.router.navigate(['/']);
      }
    });

    this.loadingLogin$ = this.store.select(s => s.user.loadingLogin);
    this.errorLogin$ = this.store.select(s => s.user.errorLogin);

    this.passwordForgotSuccess$ = this.store.select(s => s.user.successPasswordForgot);
    this.loadingPasswordForgot$ = this.store.select(s => s.user.loadingPasswordForgot);
    this.errorPasswordForgot$ = this.store.select(s => s.user.errorPasswordForgot);

    this.newConfirmationCodeSuccess$ = this.store.select(s => s.user.successNewConfirmationCode);
    this.loadingNewConfirmationCode$ = this.store.select(s => s.user.loadingNewConfirmationCode);
    this.errorNewConfirmationCode$ = this.store.select(s => s.user.errorNewConfirmationCode);
  }

  showPage(page: number): void {
    this.currentPage = page;
  }

  doLogin(credentials: Credentials) {
    this.store.dispatch(new UserActions.Login(credentials));
  }

  doPasswordForgot(val: any) {
    this.store.dispatch(new UserActions.PasswordForgot(val.email));
  }

  doEmailConfirm(val: any) {
    this.store.dispatch(new UserActions.NewConfirmationCode(val.email));
  }

  goToSignUp() {
    this.router.navigate(['user', 'signup']);
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

}
