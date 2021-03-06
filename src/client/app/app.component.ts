import {Lecture} from './service/model/lecture';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {IconService} from './shared/icon.service';
import {Store} from '@ngrx/store';
import {AppState} from './store/app-state';
import {Observable} from 'rxjs/Observable';

import * as UserActions from './store/user/user.actions';

@Component({
  selector: 'l3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  email$: Observable<string>;
  currentLecture$: Observable<Lecture>;

  constructor(private iconService: IconService, private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.iconService.init();

    // Try to load token from local storage
    this.store.dispatch(new UserActions.LoadToken());

    // Collect current logged user data (email)
    this.email$ = this.store.select(s => s.user.email);
    // Current edited/viewed lecture
    this.currentLecture$ = this.store.select(s => s.lecture.currentLecture);
  }


  onLogout() {
    this.store.dispatch(new UserActions.Logout());
    this.router.navigate(['/']);
  }
}
