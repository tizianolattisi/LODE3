import { Routes } from '@angular/router';
import { LectureViewerComponent } from './lecture-viewer/lecture-viewer.component';

export const videoRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/lecture-list'
  },
  {
    path: ':lectureId',
    pathMatch: 'full',
    component: LectureViewerComponent
  }
];
