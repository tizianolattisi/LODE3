import {Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component'
import {HomePageComponent} from "./home-page/home-page.component";
import {LoginComponent} from "../user/login/login.component";
import {SignupComponent} from "../user/signup/signup.component";
import {ConfirmAccountComponent} from "../user/confirm-account/confirm-account.component";
import {ResetPasswordComponent} from "../user/reset-password/reset-password.component";
import {CodeParamGuard} from "./code-param-guard";
import {PdfEditorComponent} from "../editor/pdf-editor/pdf-editor.component";
import {AuthGuard} from "./auth-guard";
import {VideoLectureComponent} from "../video/video-lecture/video-lecture.component";
import {ProjectorComponent} from "../lecturer/projector/projector.component";
import {TestPageComponent} from "./test-page/test-page.component";

export const appRoutes: Routes = [
    {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full'
    },
  {
    path: 'test',
    component: TestPageComponent,
    pathMatch: 'full'
  },
    {
        path: 'user',
        children: [
            {path: '', redirectTo: 'login', pathMatch: 'full'},
            {path: 'login', component: LoginComponent},
            {path: 'signup', component: SignupComponent},
            {path: 'confirm-account', component: ConfirmAccountComponent, canActivate: [CodeParamGuard]},
            {path: 'reset-password', component: ResetPasswordComponent, canActivate: [CodeParamGuard]},
        ]
    },
    {
        path: 'editor',
        component: PdfEditorComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'video',
        component: VideoLectureComponent,
        canActivate: [AuthGuard]
    },
  {
    path: 'lecturer',
    children: [
      {path: '', redirectTo: 'projector', pathMatch: 'full'},
      {path: 'projector', component: ProjectorComponent, canActivate: [AuthGuard]}
      ]
  },
    {path: '**', component: PageNotFoundComponent}
];
