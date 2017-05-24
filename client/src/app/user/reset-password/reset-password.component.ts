import {Component} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {UserService} from "../user.service";
import {ActivatedRoute} from "@angular/router";
import numberInString from "../number-in-string.validator";

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {


  public code: string;
  private form: FormGroup;
  private message: string;
  public success: boolean;

  public constructor(private userService: UserService, private route: ActivatedRoute, private fb: FormBuilder) {
    let passwordValidator = Validators.compose([Validators.required, Validators.minLength(6), numberInString]);
    this.form = fb.group({
      'password': ['', passwordValidator],
      'confirmPassword': ['', passwordValidator]
    });
  }

  ngOnInit(): void {
    // check code
    this.route.queryParams.subscribe((params) => {
      this.code = params['code'];
    });
  }

  resetPassword(form: any) {
    this.message = '';

    if (!(form.password == form.confirmPassword)) {
      this.message = "Two password are different";
      return;
    }

    this.userService.changePasswordWithCode(this.code, form.password)
      .subscribe(res => {
          this.success = true;
        },
        err => {
          if (err.status == 404) {
            this.message = "This link cannot be used to change password because it's not valid or expired.";
          } else {
            this.message = "Something gone wrong... Please retry.";
          }
        });
  }
}
