import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Credentials} from './model/credentials';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app-state';
import {toApiErrorResponse} from './to-error-response';

import * as UserActions from '../store/user/user.actions';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {

  static LS_TOKEN_KEY = 'token';

  private USER_PATH = '/api/user';


  static isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode(token);
      const d = new Date(0);
      d.setSeconds(d.getSeconds() + decodedToken.exp);
      return (d.getTime() < Date.now());
    } catch (e) {
      return true;
    }
  }

  static getTokenPayload(token: string) {
    return jwtDecode(token);
  }

  constructor(private http: HttpClient, private store: Store<AppState>) {
    // Authenticate user if token is present
    const token: string = localStorage.getItem(AuthService.LS_TOKEN_KEY);
    if (token && AuthService.isTokenExpired(token)) {
      this.store.dispatch(new UserActions.LoginSuccess(token));
    }
  }

  login(credentials: Credentials): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.USER_PATH}/login`, credentials)
      .catch(toApiErrorResponse);
  }

  logout(): Observable<any> {
    return this.http.get(`${this.USER_PATH}/logout`).catch(toApiErrorResponse);
  }

  signup(credentials: Credentials): Observable<any> {
    return this.http.post(`${this.USER_PATH}/signup`, credentials).catch(toApiErrorResponse);
  }

  confirmAccount(code: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/enable-account`, {code: code})
      .catch(toApiErrorResponse);
  }

  passwordForgot(email: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/password-forgot`, {email: email})
      .catch(toApiErrorResponse);
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/password-change`, {email, oldPassword, newPassword})
      .catch(toApiErrorResponse);
  }

  changePasswordWithCode(code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/password-change-with-code`, {code, newPassword})
      .catch(toApiErrorResponse);
  }

  requestNewConfirmationCode(email: string) {
    return this.http.post(`${this.USER_PATH}/new-confirm-code`, {email})
      .catch(toApiErrorResponse);
  }

}
