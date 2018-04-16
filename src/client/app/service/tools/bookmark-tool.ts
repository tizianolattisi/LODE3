import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {Tool} from './tool';
import {Annotation, BookmarkData} from '../model/annotation';
import {G} from 'svg.js';

import 'rxjs/add/operator/combineLatest';
import {ToggleSelection} from '../../store/annotation/annotation.actions';
import {SelectTool} from '../../store/editor/editor.actions';

export const PL_RADIUS = 80;

export const PL_GENERIC_PATH = `M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z`;

export const PL_IMPORTANT_PATH = `M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z`;

export const PL_QUESTION_PATH = `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z`;

export const PL_REMEMBER_PATH = `M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z`;

export const PL_FAVORITE_PATH = `M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z`;

export class BookmarkTool extends Tool<BookmarkData> {
  TYPE = 'bookmark';
  NAME = 'Bookmark';
  ICON = 'bookmark';

  static factory(store: Store<AppState>) {
    return new BookmarkTool(store);
  };

  constructor(store: Store<AppState>) {
    super(store);
  }

  onToolSelected(): void {}

  onToolDeselected(): void {}

  onClick = (event: MouseEvent) => {

    this.getCurrentTag().subscribe(tag => {
      const x = this.normalizePointX(event.offsetX) - (PL_RADIUS / 2);
      const y = this.normalizePointY(event.offsetY) - (PL_RADIUS / 2);

      const placeholder = this.drawPlaceholder(x, y, tag);

      this.addAnnotation({x, y, tag}).subscribe(ann => {
        // When annotation is created, add click handler
        this.addSelectionHadlers(placeholder, ann.uuid);
        placeholder.id(ann.uuid);


        // Deselect tool
        this.store.dispatch(new SelectTool('default'));

      });
    });
  };
  onDragStart = (event: any) => {};

  onDragMove = (event: any) => {};

  onDragStop = (event: any) => {};

  onDragStartTouch = (event: any) => {};

  onDragMoveTouch = (event: any) => {};

  onDragStopTouch = (event: any) => {};

  drawAnnotation(annotation: Annotation<BookmarkData>): void {
    const placeholder = this.drawPlaceholder(annotation.data.x, annotation.data.y, annotation.data.tag);
    this.addSelectionHadlers(placeholder, annotation.uuid);
    placeholder.id(annotation.uuid);
  }

  private drawPlaceholder(x: number, y: number, tag: string): G {
    const group = this.getAnnotationContainer().group();
    group.translate(x, y);
    group.circle(PL_RADIUS).addClass('note-placeholder').fill('#333333').stroke({color: lightenDarkenColor('#333333', 20), width: 5});
    let path = PL_GENERIC_PATH;
    switch (tag) {
      case 'generic':
        path = PL_GENERIC_PATH;
        break;
      case 'important':
        path = PL_IMPORTANT_PATH;
        break;
      case 'question':
        path = PL_QUESTION_PATH;
        break;
      case 'remember':
        path = PL_REMEMBER_PATH;
        break;
      case 'favorite':
        path = PL_FAVORITE_PATH;
        break;
    }
    group.path(path).fill('#FFF').transform({scaleX: 2, scaleY: 2}).translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);

    return group;
  }

  addSelectionHadlers(placeholder: any, uuid: string) {
    placeholder.click(() => {
      placeholder.colo
      this.store.dispatch(new ToggleSelection(uuid));
    });
  }


}


function lightenDarkenColor(col: string, amt: number): string {

  let usePound = false;

  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  // tslint:disable-next-line:no-bitwise
  let r = (num >> 16) + amt;

  if (r > 255) {
    r = 255;
  } else if (r < 0) {
    r = 0;
  }

  // tslint:disable-next-line:no-bitwise
  let b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }

  // tslint:disable-next-line:no-bitwise
  let g = (num & 0x0000FF) + amt;

  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }

  // tslint:disable-next-line:no-bitwise
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}
