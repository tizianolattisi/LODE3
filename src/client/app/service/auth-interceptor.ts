import {HttpEvent} from '@angular/common/http/public_api';
import {HttpRequest, HttpHandler, HttpInterceptor} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app-state';

import 'rxjs/add/operator/distinctUntilChanged';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private token: string;

  constructor(private store: Store<AppState>/*, private router: Router*/) {
    this.store.select(s => s.user).map(u => u.token).distinctUntilChanged().subscribe(token => this.token = token);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newReq = this.token ? req.clone({headers: req.headers.set('Authorization', `Bearer ${this.token}`)}) : req;
    return next.handle(newReq);
  }

  // TODO handle 401
}

