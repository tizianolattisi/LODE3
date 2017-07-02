import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs/Rx';
import {AppState} from '../../service/model/store/app-state';
import * as UserActions from '../../service/store/user/user.actions';
import {ErrorResponse} from '../../service/model/error-response';
import {Credentials} from '../../service/model/credentials';
import {PasswordForgot} from '../../service/store/user/user.actions';

@Component({
  selector: 'l3-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  private loginSubscription: Subscription;
  loadingLogin$: Observable<boolean>;
  errorLogin$: Observable<ErrorResponse>;

  passwordForgotSuccess$: Observable<boolean>;
  loadingPasswordForgot$: Observable<boolean>;
  errorPasswordForgot$: Observable<ErrorResponse>;

  newConfirmationCodeSuccess$: Observable<boolean>;
  loadingNewConfirmationCode$: Observable<boolean>;
  errorNewConfirmationCode$: Observable<ErrorResponse>;

  public currentPage = 0; // 0: login, 1: password forgot, 2: confirm email

  private defaultMsg = 'Something goes wrong... please retry.';
  loginErrMsgs = {
    400: 'Oops! Warning: No match for E-Mail Address and/or Password.',
    401: 'Oops! Warning: No match for E-Mail Address and/or Password.',
    404: 'Oops! Warning: No match for E-Mail Address and/or Password.',
    500: this.defaultMsg,
  };

  public constructor(private store: Store<AppState>, private fb: FormBuilder, private router: Router) {

    this.loginSubscription = this.store.select(s => s.user).map(u => u.token).subscribe(token => {
      // redirect if user is already logged or just logged
      if (token) {
        this.router.navigate(['/']);
      }
    });

    // init form group
    this.loginForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    const userState = this.store.select(s => s.user);

    this.loadingLogin$ = userState.map(u => u.loadingLogin);
    this.errorLogin$ = userState.map(u => u.errorLogin);

    this.passwordForgotSuccess$ = userState.map(u => u.successPasswordForgot);
    this.loadingPasswordForgot$ = userState.map(u => u.loadingPasswordForgot);
    this.errorPasswordForgot$ = userState.map(u => u.errorPasswordForgot);

    this.newConfirmationCodeSuccess$ = userState.map(u => u.successNewConfirmationCode);
    this.loadingNewConfirmationCode$ = userState.map(u => u.loadingNewConfirmationCode);
    this.errorNewConfirmationCode$ = userState.map(u => u.errorNewConfirmationCode);
  }

  showPage(page: number): void {
    this.currentPage = page;
  }

  doLogin(credentials: Credentials) {
    this.store.dispatch(new UserActions.Login(credentials));

    // this.userService.login(form.email, form.password)
    //   .subscribe(res => {
    //       this.success = true;
    //       if (this.userService.redirectUrl) {
    //         this.router.navigateByUrl(this.userService.redirectUrl);
    //         this.userService.redirectUrl = null;
    //       } else {
    //         this.router.navigate(['/']);
    //       }
    //     },
    //     err => {
    //       this.success = false;
    //       if (err.status == 400 || err.status == 404 || err.status == 401) {
    //         this.message = 'Oops! Warning: No match for E-Mail Address and/or Password.';
    //       } else {
    //         this.message = 'Something goes wrong... please retry.';
    //       }
    // });
  }

  doPasswordForgot(val: any) {
    this.store.dispatch(new UserActions.PasswordForgot(val.email));

    // this.userService.passwordForgot(form.email)
    //   .subscribe(res => {
    //       this.success = true;
    //       this.message = 'Good. Now you will receive an email with the instructions about how recover your password.';
    //     },
    //     err => {
    //       this.success = false;
    //       if (err.status == 400 || err.status == 404) {
    //         this.message = 'It seems that this email is not registered. Are you sure you have insert the right email?';
    //       } else {
    //         this.message = 'Something goes wrong... please retry.';
    //       }
    //     });
  }

  doEmailConfirm(val: any) {
    this.store.dispatch(new UserActions.NewConfirmationCode(val.email));

    // this.userService.requestNewConfirmationCode(form.email)
    //   .subscribe(res => {
    //       this.success = true;
    //       this.message = 'Now you will receive an email a confirmation link and more instructions. ' +
    //         'If you don\'t receive any mail,  please check the spam box.';
    //     },
    //     err => {
    //       this.success = false;
    //       if (err.status == 400 || err.status == 404) {
    //         this.message = 'It seems that this email is not registered. Are you sure you have insert the right email?';
    //       } else {
    //         this.message = 'Something goes wrong... please retry.';
    //       }
    //     });
  }

  goToSignUp() {
    this.router.navigate(['user', 'signup']);
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

}
