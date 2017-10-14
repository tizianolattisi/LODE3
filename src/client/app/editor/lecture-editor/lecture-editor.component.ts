import {Tool} from '../../service/tools/tool';
import {TOOLS} from '../../service/tools/tool-opaque-token';
import {SetTools} from '../../store/tool/tool.actions';
import {ScreenshotStatus} from '../../store/lecture/lecture.state';
import {Lecture} from '../../service/model/lecture';
import {Screenshot} from '../../service/model/screenshot';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

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

  currentTab: string;

  private pin: string;
  lecture: Lecture;

  slides: Screenshot[];
  currentScreenshot: Screenshot;
  currentScreenshotIndex: number;
  screenshotStatus: ScreenshotStatus;

  private lectureSubscr: Subscription;
  private slidesSubscr: Subscription;
  private screenshotStatusSubscr: Subscription;
  private currentScreenshotSubscr: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    @Inject(TOOLS) private tools: Tool[]
  ) {}

  ngOnInit() {

    // Init tools
    this.store.dispatch(new SetTools(this.tools.map(t => t.getDescription())))

    // Init lecture
    this.lectureSubscr = this.store.select(s => s.lecture.currentLecture)
      .withLatestFrom(this.store.select(s => s.lecture.currentPin))
      .subscribe(([lecture, pin]) => {

        // Save info
        this.lecture = lecture;
        this.pin = pin;

        if (lecture) {

          if (lecture.live && !pin) { // Lecture exists, it is live, but pin is missing -> go to lecture list
            console.log('No live!', lecture, pin);
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

    this.slidesSubscr = this.store.select(s => s.lecture.slides).subscribe(slides => this.slides = slides);

    this.screenshotStatusSubscr = this.store.select(s => s.lecture.snapshotStatus).subscribe(s => this.screenshotStatus = s);

    this.currentScreenshotSubscr = this.store
      .select(s => s.lecture.currentSlideIndex)
      .withLatestFrom(this.store.select(s => s.lecture.slides))
      .subscribe(([index, slides]) => {
        this.currentScreenshotIndex = index;
        this.currentScreenshot = index < 0 ? null : slides[index];

        this.cd.detectChanges();
      });

  }

  onScreenshot() {
    this.store.dispatch(new LectureActions.GetScreenshot({lectureId: this.lecture.uuid, pin: this.pin}));

    // console.log('Req');
    // this.lectureService.getScreenshot(this.lecture.uuid, this.pin).subscribe(s => {

    //   // this.store.dispatch(new LectureActions.AddSnapshot(s));

    //   this.tmpS = s;
    //   this.cd.detectChanges();
    //   console.log('Screenshot!', this.tmpS);
    // }, err => {
    //   console.log('Err', err);
    // });
  }

  onTabSelect(tab: string) {
    this.currentTab = (this.currentTab === tab) ? null : tab;
    this.cd.detectChanges();
  }

  onSlidePrev() {
    this.store.dispatch(new LectureActions.PrevSlide());
  }

  onSlideNext() {
    this.store.dispatch(new LectureActions.NextSlide());
  }

  ngOnDestroy() {
    if (this.lectureSubscr) {
      this.lectureSubscr.unsubscribe();
    }
    if (this.screenshotStatusSubscr) {
      this.screenshotStatusSubscr.unsubscribe();
    }
    if (this.currentScreenshotSubscr) {
      this.currentScreenshotSubscr.unsubscribe();
    }
    if (this.slidesSubscr) {
      this.slidesSubscr.unsubscribe();
    }
  }

}
