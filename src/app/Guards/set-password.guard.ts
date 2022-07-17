import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Store} from "@ngrx/store";
import AppState from "../Redux/app.state";
import {Observable} from "rxjs";

@Injectable()
export class SetPasswordGuard implements CanActivate{
  constructor(private store : Store<AppState>, private router : Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = route.queryParams["token"]
    let email = route.queryParams["email"]
    if (token != "" && email!="" && token!=null && email!=null)
      return true
    return this.router.createUrlTree(["auth"])
  }
}
