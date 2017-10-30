import {Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
// import {HomePageComponent} from './home-page/home-page.component';
import {AuthGuard} from './shared/auth.guard';
import {LectureListComponent} from './lecture-list/lecture-list.component';

export const appRoutes: Routes = [
  {
    path: '',
    // component: HomePageComponent,
    pathMatch: 'full',
    redirectTo: 'lecture-list'
  },
  {
    path: 'lecture-list',
    component: LectureListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule'
  },
  {
    path: 'editor',
    loadChildren: './editor/editor.module#EditorModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'video',
    loadChildren: './video/video.module#VideoModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
