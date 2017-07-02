import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpAuth} from './http-auth.service';
import {Credentials} from './model/credentials';
import {Observable} from 'rxjs/Observable';
import {AppState} from './model/store/app-state';
import {Store} from '@ngrx/store';
import * as UserActions from '../service/store/user/user.actions';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {

  static LS_TOKEN_KEY = 'token';

  private USER_PATH = '/api/user';


  static isTokenExpired(token: string): boolean {
    const decodedToken = jwtDecode(token);
    const d = new Date(0);
    d.setSeconds(d.getSeconds() + decodedToken.exp);
    return (d.getTime() < Date.now());
  }

  static getTokenPayload(token: string) {
    return jwtDecode(token);
  }

  constructor(private http: HttpAuth, private store: Store<AppState>) {
    // Authenticate user if token is present
    const token: string = localStorage.getItem(AuthService.LS_TOKEN_KEY);
    if (token && AuthService.isTokenExpired(token)) {
      this.store.dispatch(new UserActions.LoginSuccess(token));
    }
  }

  login(credentials: Credentials): Observable<string> {
    return this.http.post(`${this.USER_PATH}/login`, credentials).map(res => res.json());
  }

  logout(): Observable<Response> {
    return this.http.get(`${this.USER_PATH}/logout`);
  }

  signup(credentials: Credentials): Observable<any> {
    return this.http.post(`${this.USER_PATH}/signup`, credentials);
  }

  confirmAccount(code: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/enable-account`, {code: code});
  }

  passwordForgot(email: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/password-forgot`, {email: email});
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/password-change`, {email, oldPassword, newPassword});
  }

  changePasswordWithCode(code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.USER_PATH}/password-change-with-code`, {code, newPassword});

  }

  requestNewConfirmationCode(email: string) {
    return this.http.post(`${this.USER_PATH}/new-confirm-code`, {email});
  }

}
