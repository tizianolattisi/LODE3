import { Lecture } from './service/model/lecture';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IconService } from './shared/icon.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app-state';
import { Observable } from 'rxjs/Observable';
import { SetVideoLayout } from './store/video/video.actions'
import { Layout } from './store/video/video.state'
import { NoteSliderComponent } from './video/note-slider/note-slider.component'
import { MatDialog } from '@angular/material';
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
  isCollapsed: boolean = false

  @ViewChild('header') header: ElementRef;

  constructor(private iconService: IconService,
    private store: Store<AppState>,
    private router: Router,
    public slideDialog: MatDialog) { }

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
      this.isInViewer = (data !== Layout.NONE)
      if (data === Layout.LINEAR2 || data === Layout.TABULAR2)
        this.has3Stream = false
      if (this.isInViewer) {
        this.isCollapsed = false
        this.collapseNavbar()
      } else {
        this.isCollapsed = true
        this.collapseNavbar()
      }
    })
  }

  collapseNavbar() {
    this.isCollapsed = !this.isCollapsed
    if (this.isCollapsed) {
      this.header.nativeElement.style.marginRight = '95vw'
    } else {
      this.header.nativeElement.style.marginRight = '0'
    }

  }

  onLogout() {
    this.store.dispatch(new UserActions.Logout());
    this.router.navigate(['/']);
  }

  showSlides() {
    this.slideDialog.open(NoteSliderComponent, {
      width: '100vw'
    })
  }

  changeVideoLayout(current: string) {
    this.store.dispatch(new SetVideoLayout(Layout[current]))
  }
}
