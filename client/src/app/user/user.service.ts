import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";

declare var jwt_decode: any;

@Injectable()
export class UserService {

  private BASE_URL = '/api/users';
  private AUTH_TOKEN_KEY = 'id_token';

  HEADERS = new Headers({'Content-Type': 'application/json'});

  private _userData: BehaviorSubject<any> = new BehaviorSubject({});
  public userData: Observable<any> = this._userData.asObservable();

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: Http) {
    let token = this.getToken();
    if (token && this.isLoggedIn()) {
      this.HEADERS.append('Authorization', 'Bearer ' + token);
      this.setUserData(token);
    }
  }

  login(email: string, password: string) {

    return this.http
      .post(this.BASE_URL + '/login',
        JSON.stringify({email: email, password: password}), {headers: this.HEADERS})
      .map(res => res.json().token)
      .map((res) => {
        if (res) {

          // save token
          localStorage.setItem(this.AUTH_TOKEN_KEY, res);
          this.HEADERS.append('Authorization', 'Bearer ' + res);
          this.setUserData(res);
        }
        return res;
      });
  }

  logout() {
    // remove token in any case
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.HEADERS.delete('Authorization');
    this.setUserData(null);
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post(this.BASE_URL + '/password-change',
      JSON.stringify({
        email: this._userData.getValue().email, oldPassword: oldPassword, newPassword: newPassword
      }), {headers: this.HEADERS});
  }

  changePasswordWithCode(code: string, newPassword: string) {
    return this.http.post(this.BASE_URL + '/password-change-with-code',
      JSON.stringify({code: code, password: newPassword}), {headers: this.HEADERS});
  }

  passwordForgot(email: string) {
    return this.http.post(this.BASE_URL + '/password-forgot',
      JSON.stringify({email: email}), {headers: this.HEADERS});
  }

  signup(email: string, password: string) {
    return this.http.post(this.BASE_URL + '/signup',
      JSON.stringify({email: email, password: password}), {headers: this.HEADERS});
  }

  requestNewConfirmationCode(email: string) {

    return this.http.post(this.BASE_URL + '/new-confirm-code',
      JSON.stringify({email: email}), {headers: this.HEADERS});
  }

  confirmAccount(code: string) {

    return this.http.post(this.BASE_URL + '/enable-account',
      JSON.stringify({code: code}), {headers: this.HEADERS});
  }

  profile() {
    return this.http.get(this.BASE_URL + '/profile', {headers: this.HEADERS})
      .map(res => res.json());
  }

  isLoggedIn(): boolean {
    let token = this.getToken();

    if (token) {
      try {
        let d = new Date(0);
        let decoded = jwt_decode(token);
        d.setSeconds(d.getSeconds() + decoded.exp);
        return (d.getTime() > Date.now());
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  private setUserData(token: string): any {
    if (token) {
      let ud = jwt_decode(token);
      this._userData.next(ud ? ud : {});
    } else {
      this._userData.next({});
    }
  }

  getToken(): string {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }
}
