import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {Injectable} from "@angular/core";
import AppState from "../Redux/app.state";

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private store : Store<AppState>, private router : Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isLoggedIn = false
    this.store.select("account").subscribe(value => {
      isLoggedIn = value.id != ''
    }).unsubscribe()
    if (!isLoggedIn)
      return this.router.createUrlTree(["/auth"])
    return isLoggedIn;
  }
}
