import {Lecture} from '../../service/model/lecture';
import {Screenshot} from '../../service/model/screenshot';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Subscription, Observable} from 'rxjs/Rx';

import * as LectureActions from '../../store/lecture/lecture.actions';

import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/first';
import {LectureService} from '../../service/lecture.service';

@Component({
  selector: 'l3-lecture-editor',
  templateUrl: './lecture-editor.component.html',
  styleUrls: ['./lecture-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LectureEditorComponent implements OnInit, OnDestroy {

  tmpS: Screenshot;


  private pin: string;
  lecture: Lecture;

  slides$: Observable<Screenshot[]>;

  private lectureSubscr: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private service: LectureService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.lectureSubscr = this.store.select(s => s.lecture.currentLecture)
      .withLatestFrom(this.store.select(s => s.lecture.currentPin))
      .subscribe(([lecture, pin]) => {

        // Save info
        this.lecture = lecture;
        this.pin = pin;

        if (lecture) {

          if (lecture.live && !pin) { // Lecture exists, it is live, but pin is missing -> go to lecture list
            this.router.navigate(['/lecture-list']);
          } else {
            // TODO load users slides
            console.log('OK!', lecture, pin);
            this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid));
          }
        } else {
          // No lecture exists in store -> fetch it
          this.route.params.first().subscribe(params => this.store.dispatch(new LectureActions.FetchLecture(params['lectureId'])));
        }

      });

    this.slides$ = this.store.select(s => s.lecture.slides);

    this.slides$.subscribe(ss => { // TODO remove
      console.log('SLides', ss);
    })
  }

  getSnapshot() {
    console.log('Req');
    this.service.getScreenshot(this.lecture.uuid, this.pin).subscribe(s => {

      this.tmpS = s;
      this.cd.detectChanges();
      console.log('Screenshot!', this.tmpS);
    }, err => {
      console.log('Err', err);
    });
  }


  ngOnDestroy() {
    if (this.lectureSubscr) {
      this.lectureSubscr.unsubscribe();
    }
  }
}
