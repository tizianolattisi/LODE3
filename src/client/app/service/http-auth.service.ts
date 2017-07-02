import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from './model/store/app-state';
import {
  Http,
  Headers,
  ConnectionBackend,
  Request,
  Response,
  RequestOptions,
  RequestOptionsArgs
} from '@angular/http';
import 'rxjs/add//operator/distinctUntilChanged';

@Injectable()
export class HttpAuth extends Http {

  private token: string;
  public BASE_PATH = '/api';


  constructor(backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private store: Store<AppState>,
    private router: Router) {

    super(backend, defaultOptions);
    this.store.select(s => s.user).map(u => u.token).distinctUntilChanged().subscribe(token => this.token = token);
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

    return super.request(url, options);
  }
}
