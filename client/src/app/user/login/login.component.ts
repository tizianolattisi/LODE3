import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  private message: string;
  private success: boolean;
  public currentPage: number = 0; // 0: login, 1: password forgot, 2: confirm email

  public constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    // redirect if user is already logged
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    // init form group
    this.loginForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  showPage(page: number): void {
    this.message = '';
    this.currentPage = page;
  }

  doLogin(form: any) {
    this.message = '';
    this.userService.login(form.email, form.password)
      .subscribe(res => {
          this.success = true;
          if (this.userService.redirectUrl) {
            this.router.navigateByUrl(this.userService.redirectUrl);
            this.userService.redirectUrl = null;
          } else {
            this.router.navigate(['/']);
          }
        },
        err => {
          this.success = false;
          if (err.status == 400 || err.status == 404 || err.status == 401) {
            this.message = "Oops! Warning: No match for E-Mail Address and/or Password.";
          } else {
            this.message = "Something goes wrong... please retry.";
          }
        });
  }

  doPasswordForgot(form: any) {
    this.message = '';
    this.userService.passwordForgot(form.email)
      .subscribe(res => {
          this.success = true;
          this.message = 'Good. Now you will receive an email with the instructions about how recover your password.';
        },
        err => {
          this.success = false;
          if (err.status == 400 || err.status == 404) {
            this.message = 'It seems that this email is not registered. Are you sure you have insert the right email?';
          } else {
            this.message = "Something goes wrong... please retry.";
          }
        });
  }

  doEmailConfirm(form: any) {
    this.message = '';
    this.userService.requestNewConfirmationCode(form.email)
      .subscribe(res => {
          this.success = true;
          this.message = 'Now you will receive an email a confirmation link and more instructions. ' +
            'If you don\'t receive any mail,  please check the spam box.';
        },
        err => {
          this.success = false;
          if (err.status == 400 || err.status == 404) {
            this.message = 'It seems that this email is not registered. Are you sure you have insert the right email?';
          } else {
            this.message = "Something goes wrong... please retry.";
          }
        });
  }

  goToSignUp() {
    this.router.navigate(['user', 'signup']);
  }
}
