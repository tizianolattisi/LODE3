import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {Tool} from './tool';
import {Annotation, PencilData} from '../model/annotation';
import {Path} from 'svg.js';

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

  onToolSelected(): void {}

  onToolDeselected(): void {}

  onClick = (event: MouseEvent) => {}

  onDragStart = (event: any) => {

    this.currentPath = this.getAnnotationContainer().path(`M${event.offsetX} ${event.offsetY}`) as Path;
    this.currentPath.fill({color: 'none'});

    this.getCurrentStroke().combineLatest(this.getCurrentColor()).subscribe(([width, color]) => {
      this.currentPath.stroke({color, width});
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
      (this.currentPath as any).plot(`${d} L${event.offsetX} ${event.offsetY}`)
    }

  }

  onDragStop = (event: any) => {
    this.addAnnotation({
      path: this.currentPath.attr('d'),
      color: this.currentPath.attr('stroke'),
      width: +this.currentPath.attr('stroke-width')
    });

    this.currentPath = null;
  }

  drawAnnotation(annotation: Annotation<PencilData>): void {
    console.log('drawing panecil');
    const path = this.getAnnotationContainer().path(annotation.data.path);
    path.stroke({color: annotation.data.color, width: annotation.data.width});
    path.fill({color: 'none'});
  }

}
