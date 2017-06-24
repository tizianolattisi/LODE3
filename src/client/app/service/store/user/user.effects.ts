import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import {UserAction} from './user.actions';
import {responseToError} from '../../model/error-response';
import {AuthService} from '../../auth.service';

@Injectable()
export class UserEffects {

  @Effect()
  doLogin$ = this.actions$.ofType(UserAction.DO_LOGIN)
    .map(toPayload)
    .switchMap(payload => this.authService.login(payload)
      .map(token => ({type: UserAction.LOGIN_SUCCESS, payload: token}))
      .catch(err => Observable.of(({type: UserAction.LOGIN_ERROR, payload: responseToError(err)})))
    );

  @Effect({dispatch: false})
  loginSuccess$ = this.actions$.ofType(UserAction.LOGIN_SUCCESS)
    .map(toPayload)
    .do(payload => {
      // Save the token
      localStorage.setItem(AuthService.LS_TOKEN_KEY, payload);
    });

  @Effect({dispatch: false})
  doLogout$ = this.actions$.ofType(UserAction.DO_LOGOUT)
    .do(action => {
      // Remove the token if was previously setted
      localStorage.removeItem(AuthService.LS_TOKEN_KEY);
      this.authService.logout().subscribe(() => {});
    });

  @Effect()
  doSignup$ = this.actions$.ofType(UserAction.DO_SIGNUP)
    .map(toPayload)
    .switchMap(payload => this.authService.signup(payload)
      .map(res => ({type: UserAction.SIGNUP_SUCCESS}))
      .catch(err => Observable.of(({type: UserAction.SIGNUP_ERROR, payload: responseToError(err)})))
    );

  @Effect()
  doConfirmAccount$ = this.actions$.ofType(UserAction.DO_CONFIRM_ACCOUNT)
    .map(toPayload)
    .switchMap(payload => this.authService.confirmAccount(payload)
      .map(res => ({type: UserAction.CONFIRM_ACCOUNT_SUCCESS}))
      .catch(err => Observable.of(({type: UserAction.CONFIRM_ACCOUNT_ERROR, payload: responseToError(err)})))
    );

  @Effect()
  doPasswordForgot$ = this.actions$.ofType(UserAction.DO_PASSWORD_FORGOT)
    .map(toPayload)
    .switchMap(payload => this.authService.passwordForgot(payload)
      .map(res => ({type: UserAction.PASSWORD_FORGOT_SUCCESS}))
      .catch(err => Observable.of(({type: UserAction.PASSWORD_FORGOT_ERROR, payload: responseToError(err)})))
    );

  @Effect()
  doChangePassword$ = this.actions$.ofType(UserAction.DO_CHANGE_PASSWORD)
    .map(toPayload)
    .switchMap(payload => this.authService.changePassword(payload.email, payload.oldPassword, payload.newPassword)
      .map(res => ({type: UserAction.CHANGE_PASSWORD_SUCCESS}))
      .catch(err => Observable.of(({type: UserAction.CHANGE_PASSWORD_SUCCESS, payload: responseToError(err)})))
    );

  @Effect()
  doChangePasswordWithCode$ = this.actions$.ofType(UserAction.DO_CHANGE_PASSWORD_WITH_CODE)
    .map(toPayload)
    .switchMap(payload => this.authService.changePasswordWithCode(payload.code, payload.newPassword)
      .map(res => ({type: UserAction.CHANGE_PASSWORD_WITH_CODE_SUCCESS}))
      .catch(err => Observable.of(({type: UserAction.CHANGE_PASSWORD_WITH_CODE_ERROR, payload: responseToError(err)})))
    );

  @Effect()
  doNewConfirmationCode$ = this.actions$.ofType(UserAction.DO_NEW_CONFIRMATION_CODE)
    .map(toPayload)
    .switchMap(payload => this.authService.requestNewConfirmationCode(payload)
      .map(res => ({type: UserAction.NEW_CONFIRMATION_CODE_SUCCESS}))
      .catch(err => Observable.of(({type: UserAction.NEW_CONFIRMATION_CODE_ERROR, payload: responseToError(err)})))
    );


  constructor(private actions$: Actions, private authService: AuthService) {}
}
