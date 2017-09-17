import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {LectureService} from '../../service/lecture.service';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';

import * as LectureActions from '../../store/lecture/lecture.actions';

import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/first';

@Component({
  selector: 'l3-lecture-editor',
  templateUrl: './lecture-editor.component.html',
  styleUrls: ['./lecture-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LectureEditorComponent implements OnInit, OnDestroy {

  path: string;

  private lectureSubscr: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private service: LectureService,
    private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.lectureSubscr = this.store.select(s => s.lecture.currentLecture)
      .withLatestFrom(this.store.select(s => s.lecture.currentPin))
      .subscribe(([lecture, pin]) => {

        if (lecture) {

          if (lecture.live && !pin) { // Lecture exists, it is live, but pin is missing -> go to lecture list
            this.router.navigate(['/lecture-list']);
          } else {
            // TODO load users slides
            console.log('OK!', lecture, pin);
          }
        } else {
          // No lecture exists in store -> fetch it
          this.route.params.first().subscribe(params => this.store.dispatch(new LectureActions.FetchLecture(params['lectureId'])));
        }

      });

  }

  getSnapshot() {
    console.log('Req');
    this.service.getSnapShot('bd2485fa-bb5d-404b-87dc-cb17e05980f6').subscribe(path => {

      this.path = path;
      this.cd.detectChanges();
      console.log('Path', this.path);
    }, err => {
      const e = err.json();
      console.log('Err', e);
      this.path = e;
    });
  }


  ngOnDestroy() {
    if (this.lectureSubscr) {
      this.lectureSubscr.unsubscribe();
    }
  }
}
