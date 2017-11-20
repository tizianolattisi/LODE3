
import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {Tool} from './tool';
import {Annotation, NoteData} from '../model/annotation';

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
    console.log('Selected!');
  }

  onToolDeselected(): void {
    console.log('DeSelected!');
  }

  onClick = (event: MouseEvent) => {
    const x = event.offsetX - (PL_RADIUS / 2);
    const y = event.offsetY - (PL_RADIUS / 2);

    this.drawPlaceholder(x, y);
    this.addAnnotation({x, y, text: ''});
  };

  onDragStart = (event: any) => {};

  onDragMove = (event: any) => {};

  onDragStop = (event: any) => {};

  drawAnnotation(annotation: Annotation): void {
    const data: NoteData = annotation.data as NoteData;
    this.drawPlaceholder(data.x, data.y);
  }

  private drawPlaceholder(x: number, y: number) {
    const group = this.getAnnotationContainer().group();
    group.translate(x, y);
    group.circle(PL_RADIUS).addClass('note-placeholder');
    group.path(PL_ICON_PATH).fill('#FFF').translate(PL_RADIUS / 4.5, PL_RADIUS / 4.5);
  }

}
