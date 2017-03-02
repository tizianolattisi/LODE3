import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ConfirmAccountComponent, LoginComponent, ResetPasswordComponent, SignupComponent],
  exports: [LoginComponent, SignupComponent, ConfirmAccountComponent, ResetPasswordComponent]
})
export class UserModule { }
