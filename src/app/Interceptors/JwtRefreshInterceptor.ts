import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { catchError, EMPTY, mergeMap, Observable, throwError } from 'rxjs';
import { AppConfiguration } from '../Constants/AppConfiguration';
import AppState from '../Redux/app.state';
import { Store } from '@ngrx/store';
import { logout } from '../Redux/Actions/account.actions';
import { Router } from '@angular/router';

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
  private httpClient = inject(HttpClient);
  private appConfig = inject(AppConfiguration);
  private store = inject<Store<AppState>>(Store);
  private router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.refreshTokens().pipe(
            mergeMap(() => next.handle(req)),
            catchError(() => {
              this.store.dispatch(logout());
              this.router.navigate(['auth']);
              return EMPTY;
            })
          );
        }
        return throwError(error);
      })
    );
  }

  refreshTokens() {
    return this.httpClient.post(
      `${this.appConfig.apiEndpoint}/auth/refresh`,
      {},
      {
        withCredentials: true
      }
    );
  }
}
