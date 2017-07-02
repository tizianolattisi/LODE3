import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {responseToError} from '../../model/error-response';
import {AuthService} from '../../auth.service';
import * as UserActions from './user.actions';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class UserEffects {

  @Effect()
  doLogin$ = this.actions$.ofType(UserActions.DO_LOGIN)
    .map(toPayload)
    .switchMap(payload => this.authService.login(payload)
      .map(token => new UserActions.LoginSuccess(token))
      .catch(err => Observable.of(new UserActions.LoginError(err)))
    );

  @Effect({dispatch: false})
  loginSuccess$ = this.actions$.ofType(UserActions.LOGIN_SUCCESS)
    .map(toPayload)
    .do(payload => {
      // Save the token
      localStorage.setItem(AuthService.LS_TOKEN_KEY, payload);
    });

  @Effect({dispatch: false})
  doLogout$ = this.actions$.ofType(UserActions.DO_LOGOUT)
    .do(action => {
      // Remove the token if was previously setted
      localStorage.removeItem(AuthService.LS_TOKEN_KEY);
      this.authService.logout().subscribe(() => {});
    });

  @Effect()
  doSignup$ = this.actions$.ofType(UserActions.DO_SIGNUP)
    .map(toPayload)
    .switchMap(payload => this.authService.signup(payload)
      .map(res => new UserActions.SignupSuccess())
      .catch(err => Observable.of(new UserActions.SignupError(err)))
    );

  @Effect()
  doConfirmAccount$ = this.actions$.ofType(UserActions.DO_CONFIRM_ACCOUNT)
    .map(toPayload)
    .switchMap(payload => this.authService.confirmAccount(payload)
      .map(res => new UserActions.ConfirmAccountSuccess())
      .catch(err => Observable.of(new UserActions.ConfirmAccountError(err)))
    );

  @Effect()
  doPasswordForgot$ = this.actions$.ofType(UserActions.DO_PASSWORD_FORGOT)
    .map(toPayload)
    .switchMap(payload => this.authService.passwordForgot(payload)
      .map(res => new UserActions.PasswordForgotSuccess())
      .catch(err => Observable.of(new UserActions.PasswordForgotError(err)))
    );

  @Effect()
  doChangePassword$ = this.actions$.ofType(UserActions.DO_CHANGE_PASSWORD)
    .map(toPayload)
    .switchMap(payload => this.authService.changePassword(payload.email, payload.oldPassword, payload.newPassword)
      .map(res => new UserActions.ChangePasswordSuccess())
      .catch(err => Observable.of(new UserActions.ChangePasswordError(err)))
    );

  @Effect()
  doChangePasswordWithCode$ = this.actions$.ofType(UserActions.DO_CHANGE_PASSWORD_WITH_CODE)
    .map(toPayload)
    .switchMap(payload => this.authService.changePasswordWithCode(payload.code, payload.newPassword)
      .map(res => new UserActions.ChangePasswordWithCodeSuccess())
      .catch(err => Observable.of(new UserActions.ChangePasswordWithCodeError(err)))
    );

  @Effect()
  doNewConfirmationCode$ = this.actions$.ofType(UserActions.DO_NEW_CONFIRMATION_CODE)
    .map(toPayload)
    .switchMap(payload => this.authService.requestNewConfirmationCode(payload)
      .map(res => new UserActions.NewConfirmationCodeSuccess())
      .catch(err => Observable.of(new UserActions.NewConfirmationCodeError(err)))
    );


  constructor(private actions$: Actions, private authService: AuthService) {}
}
