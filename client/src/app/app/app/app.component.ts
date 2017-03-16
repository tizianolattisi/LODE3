import { Component } from '@angular/core';
import {Router, NavigationStart, NavigationEnd, Event} from "@angular/router";
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  loading = true;
  userData: any;

  constructor(private router: Router, public userService: UserService) {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      }
    });

    this.userService.userData.subscribe(ud => {
      this.userData = ud;
    })
  }

  doLogout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
