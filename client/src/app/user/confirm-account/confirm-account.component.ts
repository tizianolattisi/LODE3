import { Component } from '@angular/core';
import {UserService} from "../user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent {

  complete: boolean = false;
  errMsg: string = '';
  error: boolean = false;

  public constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let code = params['code'];
      if (!code) {
        this.complete = true;
        this.error = true;
        this.errMsg = 'No code has been supplied';
        return;
      }

      this.userService.confirmAccount(code)
        .subscribe((res)=> {
          this.complete = true;
        }, (err)=> {
          this.error = true;
          this.complete = true;
          if (err.status = 404) {
            this.errMsg = "The link is not valid or the account has already been activated.";
          } else {
            this.errMsg = "An error has occurred.";
          }
        });
    });
  }

  goToLogin() {
    this.router.navigate(['user', 'login']);
  }
}
