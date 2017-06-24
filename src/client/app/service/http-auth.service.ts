import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserAction } from './store/user/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from './model/store/app-state';
import {
  Http,
  Headers,
  ConnectionBackend,
  Request,
  Response,
  RequestOptions,
  RequestOptionsArgs
} from '@angular/http';

@Injectable()
export class HttpAuth extends Http {

  private token: string;
  public BASE_PATH = '/api';


  constructor(backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private store: Store<AppState>,
    private userAction: UserAction,
    private router: Router) {

    super(backend, defaultOptions);
    this.store.select(s => s.user).map(u => u.token).subscribe(token => this.token = token);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    options = options || new RequestOptions();

    // Set the token if available
    if (this.token) {
      if (!options.headers) {
        options.headers = new Headers();
      }
      options.headers.set('Authorization', `Bearer ${this.token}`);

      if (url instanceof Request) {
        url.headers.set('Authorization', `Bearer ${this.token}`);
      }
    }

    // Perform the request. Return to / if user is unauthenticated
    return super.request(url, options)
      .catch((err: Response) => {
        // if (err.status === 401) {
        //   // this.userAction.uiLoginError(err.json());
        //   this.router.navigate(['/']);
        // }
        return Observable.throw(err);
      });
  }
}
