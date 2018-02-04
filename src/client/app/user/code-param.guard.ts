import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class CodeParamGuard implements CanActivate, Resolve<string> {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const code = route.queryParams['code'];
    if (code) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
    return route.queryParams['code'];
  }
}
