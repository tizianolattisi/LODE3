import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {Tool} from './tool';
import {Annotation, BookmarkData} from '../model/annotation';
import {G} from 'svg.js';

import 'rxjs/add/operator/combineLatest';
import {ToggleSelection} from '../../store/annotation/annotation.actions';
import {SelectTool, SetColor} from '../../store/editor/editor.actions';

export const PL_RADIUS = 80;

export const PL_ICON_PATH = `M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z`;

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

  onToolSelected(): void {
    this.store.dispatch(new SetColor('#59ff27'));
  }

  onToolDeselected(): void {}

  onClick = (event: MouseEvent) => {

    this.getCurrentColor().subscribe(color => {
      const x = this.normalizePointX(event.offsetX) - (PL_RADIUS / 2);
      const y = this.normalizePointY(event.offsetY) - (PL_RADIUS / 2);

      const placeholder = this.drawPlaceholder(x, y, color);

      this.addAnnotation({x, y, title: 'Note', color}).subscribe(ann => {
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
    const placeholder = this.drawPlaceholder(annotation.data.x, annotation.data.y, annotation.data.color);
    this.addSelectionHadlers(placeholder, annotation.uuid);
    placeholder.id(annotation.uuid);
  }

  private drawPlaceholder(x: number, y: number, color: string): G {
    const group = this.getAnnotationContainer().group();
    group.translate(x, y);
    group.circle(PL_RADIUS).addClass('note-placeholder').fill({color}).stroke({color: lightenDarkenColor(color, 20), width: 5});
    group.path(PL_ICON_PATH).fill('#FFF').transform({scaleX: 2, scaleY: 2}).translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);

    return group;
  }

  addSelectionHadlers(placeholder: any, uuid: string) {
    console.log("addSelectionHadlers");
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
