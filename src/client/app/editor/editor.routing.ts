import {Routes} from '@angular/router';
import {LectureEditorComponent} from './lecture-editor/lecture-editor.component';

export const editorRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/lecture-list'
  },
  {
    path: ':lectureId',
    pathMatch: 'full',
    component: LectureEditorComponent
  }
];
