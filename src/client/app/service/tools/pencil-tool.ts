import {AppState} from '../../store/app-state';
import {Store} from '@ngrx/store';
import {Tool} from './tool';
import {Annotation, PencilData} from '../model/annotation';

export class PencilTool extends Tool<PencilData> {
  TYPE = 'pencil';
  NAME = 'Pencil';
  ICON = 'pencil';

  static factory(store: Store<AppState>) {
    return new PencilTool(store);
  };

  constructor(store: Store<AppState>) {
    super(store);
    // super(store);
  }

  onToolSelected(): void {
    console.log('Selected!');
  }

  onToolDeselected(): void {
    console.log('DeSelected!');
  }

  onClick = (event: MouseEvent) => {
    console.log('Click!');
  }

  onDragStart = (event: any) => {
    console.log('Drag Start!');
  }

  onDragMove = (event: any) => {
    console.log('Drag Move!');
  }

  onDragStop = (event: any) => {
    console.log('Drag Stop!');
  }

  drawAnnotation(annotation: Annotation): void {
    throw new Error('Not implemented yet.');
  }

}
