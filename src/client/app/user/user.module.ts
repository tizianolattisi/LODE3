import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {userRoutes} from './user.routing';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ConfirmAccountComponent} from './confirm-account/confirm-account.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {CodeParamGuard} from './code-param.guard';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {ErrorMessageComponent} from './error-message/error-message.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(userRoutes),
    MaterialModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    ConfirmAccountComponent,
    ResetPasswordComponent,
    ErrorMessageComponent
  ],
  providers: [
    CodeParamGuard
  ]
})
export class UserModule {}
