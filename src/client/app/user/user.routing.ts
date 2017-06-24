import { Routes } from '@angular/router';
import { CodeParamGuard } from './code-param.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const userRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login', // TODO guard to not enter if already logged
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'confirm-account',
    component: ConfirmAccountComponent,
    canActivate: [CodeParamGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [CodeParamGuard]
  },
];
