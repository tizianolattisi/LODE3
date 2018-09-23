import { ErrorResponse } from '../../service/model/error-response';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { Credentials } from '../../service/model/credentials';

import * as UserActions from '../../store/user/user.actions';
import { emailValidator } from '../email.validator';
import { passwordValidator } from '../password.validator';

@Component({
  selector: 'l3-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  signupSuccess$: Observable<boolean>;
  loadingSignup$: Observable<boolean>;
  errorSignup$: Observable<ErrorResponse>;

  private defaultMsg = 'Something goes wrong... please retry.';
  errMsgs = {
    400: 'Some fields are wrong or user already exists. Please check them.',
    500: this.defaultMsg,
  };

  public constructor(private store: Store<AppState>, private fb: FormBuilder) {

    // init form group
    this.form = this.fb.group({
      'email': ['', [Validators.required, emailValidator()]],
      'password': ['', [Validators.required, Validators.minLength(6), passwordValidator()]],
      'password_retype': ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.signupSuccess$ = this.store.select(s => s.user.sucessSignup);

    this.loadingSignup$ = this.store.select(s => s.user.loadingSignup);
    this.errorSignup$ = this.store.select(s => s.user.errorSignup);

  }

  doSignUp(credentials: Credentials) {

    // Check password matching
    if (credentials.password !== (credentials as any).password_retype) {

      this.form.controls['password'].setErrors({ 'passwordmismatch': 'Passwords does not match' });
      this.form.controls['password_retype'].setErrors({ 'passwordmismatch': 'Passwords does not match' });

    } else {
      this.store.dispatch(new UserActions.Signup(credentials));
    }
  }
}
