import { Component } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {UserService} from "../user.service";
import numberInString from "../number-in-string.validator";

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  private message: string;
  public success: boolean;

  public constructor(private userService: UserService, private fb: FormBuilder) {
    let passwordValidator = Validators.compose([Validators.required, Validators.minLength(6), numberInString]);

    this.signupForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern('.+@.*\.?unitn\.it$')])],
      'password': ['', passwordValidator],
      'confirmPassword': ['', passwordValidator]
    });
  }

  doSignup(form: any) {
    this.message = '';

    if (!(form.password == form.confirmPassword)) {
      this.message = "Two password are different";
      return;
    }

    this.userService.signup(form.email, form.password)
      .subscribe(res => {
          this.success = true;
        },
        err => {
          if (err.status == 400) {
            let msg = err.json();
            switch (msg.code) {
              case'user_already_exist':
                this.message = "A user with provided email is already registered. Please use another email.";
                break;
              case'not_unitn_mail':
                this.message = "Please use a UniTN email (eg: name.surname@studenti.unitn.it).";
                break;
              default:
                this.message = "Please check again provided data.";
                break;
            }
          } else {
            this.message = "Something gone wrong..."
          }
        });
  }
}
