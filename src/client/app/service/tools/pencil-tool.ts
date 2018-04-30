import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { Tool } from './tool';
import { Annotation, PencilData } from '../model/annotation';
import { ToggleSelection } from '../../store/annotation/annotation.actions';
import { Path } from 'svg.js';

import 'rxjs/add/operator/combineLatest';

export class PencilTool extends Tool<PencilData> {
  TYPE = 'pencil';
  NAME = 'Pencil';
  ICON = 'pencil';

  currentPath: Path = null;

  static factory(store: Store<AppState>) {
    return new PencilTool(store);
  };

  constructor(store: Store<AppState>) {
    super(store);
  }

  onToolSelected(): void { }

  onToolDeselected(): void { }

  onClick = (event: MouseEvent) => { }

  onDragStart = (event: any) => {

    this.currentPath = this.getAnnotationContainer().path(
      `M${this.normalizePointX(event.offsetX)} ${this.normalizePointY(event.offsetY)}`
    ) as Path;
    this.currentPath.fill({ color: 'none' });

    this.getCurrentStroke().combineLatest(this.getCurrentColor()).subscribe(([width, color]) => {
      this.currentPath.stroke({ color, width });
    });
  }

  onDragMove = (event: any) => {
    if (this.currentPath) {
      const d: string = this.currentPath.attr('d');
      // if (d.indexOf('C') !== -1) {
      //   (this.currentPath as any).plot(`${d} ${event.offsetX} ${event.offsetY}`)
      // } else {
      //   (this.currentPath as any).plot(`${d} C${event.offsetX} ${event.offsetY}`)
      // }
      (this.currentPath as any).plot(`${d} L${this.normalizePointX(event.offsetX)} ${this.normalizePointY(event.offsetY)}`)
    }

  }

  onDragStop = (event: any) => {
    this.addAnnotation({
      path: this.currentPath.attr('d'),
      color: this.currentPath.attr('stroke'),
      width: +this.currentPath.attr('stroke-width')
    }).subscribe(ann => {
      this.addSelectionHadlers(this.currentPath, ann.uuid);
      this.currentPath.id(ann.uuid);
    });

    this.currentPath = null;
  }

  onDragStartTouch = (event: any) => {

    event.preventDefault();

    this.currentPath = this.getAnnotationContainer().path(
      `M${this.normalizePointX(event.layerX)} ${this.normalizePointY(event.layerY)}`
    ) as Path;
    this.currentPath.fill({ color: 'none' });

    this.getCurrentStroke().combineLatest(this.getCurrentColor()).subscribe(([width, color]) => {
      this.currentPath.stroke({ color, width });
    });
  }

  onDragMoveTouch = (event: any) => {

    event.preventDefault();

    if (this.currentPath) {
      const d: string = this.currentPath.attr('d');
      // if (d.indexOf('C') !== -1) {
      //   (this.currentPath as any).plot(`${d} ${event.offsetX} ${event.offsetY}`)
      // } else {
      //   (this.currentPath as any).plot(`${d} C${event.offsetX} ${event.offsetY}`)
      // }
      (this.currentPath as any).plot(`${d} L${this.normalizePointX(event.layerX)} ${this.normalizePointY(event.layerY)}`)
    }

  }

  onDragStopTouch = (event: any) => {

    event.preventDefault();

    this.addAnnotation({
      path: this.currentPath.attr('d'),
      color: this.currentPath.attr('stroke'),
      width: +this.currentPath.attr('stroke-width')
    }).subscribe(ann => {
      this.addSelectionHadlers(this.currentPath, ann.uuid);
      this.currentPath.id(ann.uuid);
    });

    this.currentPath = null;
  }

  drawAnnotation(annotation: Annotation<PencilData>): void {
    const path = this.getAnnotationContainer().path(annotation.data.path);
    path.stroke({ color: annotation.data.color, width: annotation.data.width });
    path.fill({ color: 'none' });
    this.addSelectionHadlers(path, annotation.uuid);
    path.id('a' + annotation.uuid); // query selector non accetta id che inizino con un numero
  }

  addSelectionHadlers(path: any, uuid: string) {
    path.click(() => {
      this.store.dispatch(new ToggleSelection(uuid));
    });
  }

}
