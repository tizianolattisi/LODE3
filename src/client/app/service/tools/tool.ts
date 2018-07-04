import {Store} from '@ngrx/store';
import {Annotation, DataType} from '../model/annotation';
import {ToolDescription} from '../model/tool-description';
import {AppState} from '../../store/app-state';
import {AddAnnotation} from '../../store/annotation/annotation.actions';
import {Doc} from 'svg.js';
import {Observable} from 'rxjs/Observable';
import {CANVAS_SIZE, getCanvasHeight} from '../../shared/canvas-size';


import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/first';


export abstract class Tool<T extends DataType> { // T is the type of data produced by the tool

  readonly abstract TYPE: string;
  readonly abstract NAME: string;
  readonly abstract ICON: string;

  private annotationContainer: Doc;

  // handlers
  public abstract onClick: (event: MouseEvent) => void;
  public abstract onDragStart: (event: any) => void;
  public abstract onDragMove: (event: any) => void;
  public abstract onDragStop: (event: any) => void;
  public abstract onDragStartTouch: (event: any) => void;
  public abstract onDragMoveTouch: (event: any) => void;
  public abstract onDragStopTouch: (event: any) => void;

  constructor(protected store: Store<AppState>) {
    store.select(s => s.editor.annotationContainer).subscribe(a => {
      this.annotationContainer = a;
    });
  }

  public abstract onToolSelected(): void;
  public abstract onToolDeselected(): void;

  public abstract drawAnnotation(annotation: Annotation<T>): void;

  // editAnnotation: (object: IObject, annotation: Annotation) => Annotation;

  getDescription(): ToolDescription {
    return {
      name: this.NAME,
      type: this.TYPE,
      icon: this.ICON,
      tool: this
    }
  }

  getAnnotationContainer(): Doc {
    return this.annotationContainer;
  }

  addAnnotation(data: T): Observable<Annotation<T>> {
    return Observable.create((subscriber => {
      this.store.select(s => s.lecture.currentLecture) // Get current lecture -> to get lecture id
        .take(1)
        .withLatestFrom(
        this.store.select(s => s.lecture.slides), // Get slides -> to get slide id
        this.store.select(s => s.lecture.currentSlideIndex) // Get current slide index -> to get slide id
        )
        .subscribe(([lecture, slides, index]) => {
          const ann: Annotation<T> = {
            uuid: this.generateUUID(),
            lectureId: lecture.uuid,
            slideId: slides[index].uuid,
            type: this.TYPE,
            timestamp: Math.round(Date.now() / 1000),
            data: data
          };
          // Send action add annotation
          this.store.dispatch(new AddAnnotation(ann));

          // return annotation
          subscriber.next(ann);
          subscriber.complete();
        });
    }));
  }

  getCurrentStroke(): Observable<number> {
    return this.store.select(s => s.editor.stroke).first();
  }

  getCurrentColor(): Observable<string> {
    return this.store.select(s => s.editor.color).first();
  }

  getCurrentTag(): Observable<string> {
    return this.store.select(s => s.editor.tag).first();
  }

  private generateUUID(): string {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  };

  normalizePointX(point: number): number {
    return (point * CANVAS_SIZE.W) / this.annotationContainer.width();
  }

  normalizePointY(point: number): number {
    return (point * getCanvasHeight(this.annotationContainer.width(), this.annotationContainer.height())) /
      this.annotationContainer.height();
  }

}
