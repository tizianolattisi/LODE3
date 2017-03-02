import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";

@Injectable()
export class CodeParamGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let code = route.queryParams['code'];
        if (code) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}