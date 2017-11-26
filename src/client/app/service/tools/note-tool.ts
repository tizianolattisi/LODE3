
import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {Tool} from './tool';
import {Annotation, NoteData} from '../model/annotation';
import {SetColor} from '../../store/editor/editor.actions';
import {OpenNote} from '../../store/annotation/annotation.actions';
import {G} from 'svg.js';

export const PL_RADIUS = 40;

export const PL_ICON_PATH = `M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18`;

export class NoteTool extends Tool<NoteData> {
  TYPE = 'note';
  NAME = 'Note';
  ICON = 'message-text';

  static factory(store: Store<AppState>) {
    return new NoteTool(store);
  };

  constructor(store: Store<AppState>) {
    super(store);
  }

  onToolSelected(): void {
    this.store.dispatch(new SetColor('#FFCA28'));
  }

  onToolDeselected(): void {}

  onClick = (event: MouseEvent) => {

    this.getCurrentColor().subscribe(color => {
      const x = event.offsetX - (PL_RADIUS / 2);
      const y = event.offsetY - (PL_RADIUS / 2);

      const placeholder = this.drawPlaceholder(x, y, color);

      this.addAnnotation({x, y, text: '', title: 'Note', color}).subscribe(ann => {
        // When annotation is created, add click handler
        this.addHandlers(placeholder, ann.slideId, ann.uuid);
      });
    });
  };

  onDragStart = (event: any) => {};

  onDragMove = (event: any) => {};

  onDragStop = (event: any) => {};

  drawAnnotation(annotation: Annotation<NoteData>): void {
    const placeholder = this.drawPlaceholder(annotation.data.x, annotation.data.y, annotation.data.color);
    this.addHandlers(placeholder, annotation.slideId, annotation.uuid);
  }

  private drawPlaceholder(x: number, y: number, color: string): G {
    const group = this.getAnnotationContainer().group();
    group.translate(x, y);
    group.circle(PL_RADIUS).addClass('note-placeholder').fill({color}).stroke({color: lightenDarkenColor(color, 20)});
    group.path(PL_ICON_PATH).fill('#FFF').translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);

    return group;
  }

  private addHandlers(placeholder: G, slideId: string, annotationId: string) {
    placeholder.click(() => {
      this.store.dispatch(new OpenNote({slideId, annotationId}));
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
