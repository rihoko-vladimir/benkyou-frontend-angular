import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import { Observable } from 'rxjs';

@Injectable()
export class SetPasswordGuard {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = route.queryParams['token'];
    const email = route.queryParams['email'];
    if (token !== '' && email !== '' && token !== null && email !== null) return true;
    return this.router.createUrlTree(['auth']);
  }
}
