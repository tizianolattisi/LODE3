import {
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FetchAnnotations,
  SetAnnotations,
  SetAnnotationsPerSlide,
  ClearAnnotationWorkspace
} from '../../store/annotation/annotation.actions';
import {Annotation, DataType} from '../../service/model/annotation';
import {WsFromServerEvents} from '../../service/model/ws-msg';
import {SocketService} from '../../service/socket.service';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {SetAnnotationContainer, SetTools} from '../../store/editor/editor.actions';
import {Tool} from '../../service/tools/tool';
import {TOOLS} from '../../service/tools/tool-opaque-token';
import {ScreenshotStatus} from '../../store/lecture/lecture.state';
import {Lecture} from '../../service/model/lecture';
import {Screenshot} from '../../service/model/screenshot';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '../../store/app-state';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Doc} from 'svg.js';
import {Observable} from 'rxjs/Observable';

import * as LectureActions from '../../store/lecture/lecture.actions';
import * as SVG from 'svg.js';

import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import {checkIsTouchDevice} from '../../shared/touch-device-detect';


@Component({
  selector: 'l3-lecture-editor',
  templateUrl: './lecture-editor.component.html',
  styleUrls: ['./lecture-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LectureEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('annotationContainer')
  annotationContainer: ElementRef;

  @ViewChild('imageContainer')
  imageContainer: ElementRef;

  currentTab: string;

  private pin: string;
  lecture: Lecture;

  isTouchDevice: boolean;

  slides: Screenshot[];
  currentSlide: Screenshot;
  currentSlideIndex: number;
  screenshotStatus: ScreenshotStatus;
  currentAnnotations: Annotation<DataType>[];
  openNotes$: Observable<{
    slideId: string; annotationId: string;
  }[]>;

  private lectureSubscr: Subscription;
  private slidesSubscr: Subscription;
  private screenshotStatusSubscr: Subscription;
  private currentSlideSubscr: Subscription;
  private socketSubscr: Subscription;
  private annotationSubscr: Subscription;
  private annotationSelectionSubscr: Subscription;

  private svgAnnotationContainer: Doc;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private socketService: SocketService,
    private snackBar: MatSnackBar,
    @Inject(TOOLS) private tools: Tool<DataType>[]
  ) {}

  ngOnInit() {


    // Is a touch device?
    this.isTouchDevice = checkIsTouchDevice();

    // Init tools
    this.store.dispatch(new SetTools(this.tools.map(t => t.getDescription())))

    // Collect data about the annotations taken in the current lecture
    this.initAnnotations();

    // Collect data about the current lecture to show
    this.initLecture();

    // Collect data about the slides of the current lecture
    this.initSlides();

  }

  public ngAfterViewInit(): void {

    // Register annotation container in store -> it will be available inside tools
    this.svgAnnotationContainer = SVG.adopt(this.annotationContainer.nativeElement) as Doc;
    this.store.dispatch(new SetAnnotationContainer(this.svgAnnotationContainer));
  }

  initLecture() {

    // Init lecture -> collect data about the current lecture
    this.lectureSubscr = this.store.select(s => s.lecture.currentLecture)
      // Get the pin (present in the store if current lecture is a live lecture)
      .withLatestFrom(this.store.select(s => s.lecture.currentPin), this.store.select(s => s.user.token))
      .subscribe(([lecture, pin, token]) => {

        // Save info in the component
        this.lecture = lecture;
        this.pin = pin;

        // Check if "current selected lecture" exists in the store
        if (lecture) {

          if (lecture.live && !pin) { // Lecture exists, it is live, but pin is missing -> go back to lecture list
            this.router.navigate(['/lecture-list']);
          } else {
            // Lecture exists -> fetch screenshots of this user
            this.store.dispatch(new LectureActions.FetchUserScreenshots(lecture.uuid));
            this.socketService.open(token);
          }

        } else {
          // No lecture exists in store (page was opened directly using url and not from lecture list page) -> fetch lecture info
          this.route.params.first().subscribe(params => this.store.dispatch(new LectureActions.FetchLecture(params['lectureId'])));
        }

        this.cd.detectChanges();
      });

    // Init slides (listen for slides of the lecture present in the store)
    this.slidesSubscr = this.store.select(s => s.lecture.slides).subscribe(slides => {
      this.slides = slides;
      this.cd.detectChanges();
    });

  }

  initSlides() {
    // Listen for status of "take screenshot" action
    this.screenshotStatusSubscr = this.store.select(s => s.lecture.snapshotStatus).subscribe(s => {
      this.screenshotStatus = s;
      this.cd.detectChanges();
    });

    // Listen for the current screenshot to show
    this.currentSlideSubscr = this.store
      .select(s => s.lecture.currentSlideIndex)
      .withLatestFrom(this.store.select(s => s.lecture.slides))
      .subscribe(([index, slides]) => {
        // Update current slide
        this.currentSlideIndex = index;
        this.currentSlide = index < 0 ? null : slides[index];
        this.clearAnnotationContainer();

        if (index !== -1 && this.currentSlide) {
          // Fetch annotations // TODO if not already done
          this.store.dispatch(new FetchAnnotations({lectureId: this.lecture.uuid, slideId: this.currentSlide._id}));
        }

        this.cd.detectChanges();
      });

  }

  initAnnotations() {

    this.openNotes$ = this.store.select(s => s.annotation.openNotes);

    this.socketSubscr = this.socketService.onReceive().subscribe(msg => {
      if (msg.event === WsFromServerEvents.ANNOTATION_GET) {

        // Annotations from server
        const anns: Annotation<DataType>[] = msg.data;
        const res = this.convertAnnotations(anns);


        const slideIds = Object.keys(res);
        if (slideIds.length === 1) {
          this.store.dispatch(new SetAnnotationsPerSlide({slideId: slideIds[0], annotations: res[slideIds[0]]}));
        } else {
          this.store.dispatch(new SetAnnotations(res));
        }
      } else if (
        msg.event === WsFromServerEvents.ANNOTATION_ADD_FAIL ||
        msg.event === WsFromServerEvents.ANNOTATION_EDIT_FAIL ||
        msg.event === WsFromServerEvents.ANNOTATION_DELETE_FAIL) {
        this.snackBar.open('An error occurred while saving the annotation', 'Ok');
      }
      this.cd.detectChanges();
    });


    // Load current annotations
    this.annotationSubscr = this.store.select(s => s.annotation.annotations)
      .filter(() => !!this.currentSlide)
      .map(anns => anns[this.currentSlide._id])
      // .filter(anns => !!anns)
      .subscribe(anns => {

        this.clearAnnotationContainer();


        this.currentAnnotations = Object.keys(anns || {}).map(uuid => anns[uuid]);
        this.currentAnnotations.forEach(a => {
          const tool = this.getTool(a.type);
          if (tool) {
            tool.drawAnnotation(a);
          }
        });
        this.cd.detectChanges();
      });


    // Select annotation on canvas when selected annotation set changes
    this.annotationSelectionSubscr = this.store.select(s => s.annotation.selectedAnnotations)
      .filter(() => !!this.svgAnnotationContainer)
      .subscribe(selection => {
        // Remove previous selections // TODO does not work properly
        this.svgAnnotationContainer.select('.bbox').each((i, element) => {
          if (element[0].node.parentElement) {
            element[0].node.parentElement.removeChild(element[0].node);
          }
        });

        // Add new selections
        selection
          .map(uuid => SVG.get(uuid))
          .filter(item => (item && item.type !== 'g'))
          .forEach(item => {
            const bbox = item.bbox();
            this.svgAnnotationContainer.rect(bbox.width, bbox.height).addClass('bbox').move(bbox.x, bbox.y);
          });

        this.cd.detectChanges();
      });

  }

  private convertAnnotations(anns: Annotation<DataType>[]): {[slideId: string]: {[uuid: string]: Annotation<DataType>}} {
    const res = {};

    anns.filter(ann => this.lecture.uuid === ann.lectureId).forEach(ann => {
      if (!res[ann.slideId]) {
        res[ann.slideId] = {};
      }
      res[ann.slideId][ann.uuid] = ann;
    });

    return res;
  }

  onScreenshot() {
    // Request to take a new screenshot using the pin
    this.store.dispatch(new LectureActions.GetScreenshot({lectureId: this.lecture.uuid, pin: this.pin}));
  }

  onBlankPage() {
    // Request to add a new blank page to the collection using the pin
    this.store.dispatch(new LectureActions.GetBlankPage({lectureId: this.lecture.uuid, pin: this.pin}));
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


  private getTool(type: string): Tool<DataType> {
    if (!this.tools) {
      return null;
    }
    const index = this.tools.map(t => t.TYPE).indexOf(type);
    return index !== -1 ? this.tools[index] : null;
  }

  private clearAnnotationContainer() {
    // Clear container
    if (this.annotationContainer.nativeElement) {
      // (SVG.adopt(this.annotationContainer.nativeElement) as SVG.Doc).clear();
      this.annotationContainer.nativeElement.innerHTML = '';
    }
  }

  ngOnDestroy() {
    if (this.lectureSubscr) {
      this.lectureSubscr.unsubscribe();
    }
    if (this.screenshotStatusSubscr) {
      this.screenshotStatusSubscr.unsubscribe();
    }
    if (this.currentSlideSubscr) {
      this.currentSlideSubscr.unsubscribe();
    }
    if (this.slidesSubscr) {
      this.slidesSubscr.unsubscribe();
    }
    if (this.socketSubscr) {
      this.socketSubscr.unsubscribe();
    }
    if (this.annotationSubscr) {
      this.annotationSubscr.unsubscribe();
    }
    if (this.annotationSelectionSubscr) {
      this.annotationSelectionSubscr.unsubscribe();
    }

    this.store.dispatch(new ClearAnnotationWorkspace());
  }

}
