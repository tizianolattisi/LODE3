import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {UserService} from "../user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let logged = this.userService.isLoggedIn();
        if (logged) {
            return true;
        } else {
            // save url and redirect to login page
            this.userService.redirectUrl = state.url;
            this.router.navigate(['/user/login']);
            return false;
        }
    }
}
