import {Store} from '@ngrx/store';
import {Annotation, DataType} from '../model/annotation';
import {ToolDescription} from '../model/tool-description';
import {AppState} from '../../store/app-state';
import {AddAnnotation} from '../../store/annotation/annotation.actions';

import * as SVG from 'svg.js';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';

export abstract class Tool<T extends DataType> { // T is the type of data produced by the tool

  readonly abstract TYPE: string;
  readonly abstract NAME: string;
  readonly abstract ICON: string;

  private annotationContainer: SVG.Doc;

  // handlers
  public abstract onClick: (event: MouseEvent) => void;
  public abstract onDragStart: (event: any) => void;
  public abstract onDragMove: (event: any) => void;
  public abstract onDragStop: (event: any) => void;

  constructor(protected store: Store<AppState>) {
    store.select(s => s.editor.annotationContainer).subscribe(a => {
      this.annotationContainer = a;
    });
  }

  public abstract onToolSelected(): void;
  public abstract onToolDeselected(): void;

  public abstract drawAnnotation(annotation: Annotation): void;

  // editAnnotation: (object: IObject, annotation: Annotation) => Annotation;

  getDescription(): ToolDescription {
    return {
      name: this.NAME,
      type: this.TYPE,
      icon: this.ICON,
      tool: this
    }
  }

  getAnnotationContainer(): SVG.Doc {
    return this.annotationContainer;
  }

  addAnnotation(data: T) {
    this.store.select(s => s.lecture.currentLecture) // Get current lecture -> to get lecture id
      .take(1)
      .withLatestFrom(
      this.store.select(s => s.lecture.slides), // Get slides -> to get slide id
      this.store.select(s => s.lecture.currentSlideIndex) // Get current slide index -> to get slide id
      )
      .subscribe(([lecture, slides, index]) => {
        // Send action add annotation
        this.store.dispatch(new AddAnnotation({
          uuid: this.generateUUID(),
          lectureId: lecture.uuid,
          slideId: slides[index]._id,
          type: this.TYPE,
          timestamp: Math.round(Date.now() / 1000),
          data: data
        }));
      });

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


}
