import { Lecture } from './service/model/lecture';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IconService } from './shared/icon.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app-state';
import { Observable } from 'rxjs/Observable';
import { SetVideoLayout } from './store/video/video.actions'
import { Layout } from './store/video/video.state'
import * as UserActions from './store/user/user.actions';

@Component({
  selector: 'l3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  email$: Observable<string>;
  currentLecture$: Observable<Lecture>;
  isInViewer: boolean
  has3Stream: boolean = true

  constructor(private iconService: IconService, private store: Store<AppState>, private router: Router) { }

  ngOnInit() {
    this.iconService.init();

    // Try to load token from local storage
    this.store.dispatch(new UserActions.LoadToken());

    // Collect current logged user data (email)
    this.email$ = this.store.select(s => s.user.email);
    // Current edited/viewed lecture
    this.currentLecture$ = this.store.select(s => s.lecture.currentLecture);

    // Verify if user is in the viewer
    this.store.select(s => s.video.videoLayout).subscribe(data => {
      this.isInViewer = data !== Layout.NONE
      if (data === Layout.LINEAR2 || data === Layout.TABULAR2)
        this.has3Stream = false
    })
  }


  onLogout() {
    this.store.dispatch(new UserActions.Logout());
    this.router.navigate(['/']);
  }

  changeVideoLayout(current: string) {
    this.store.dispatch(new SetVideoLayout(Layout[current]))
  }
}
