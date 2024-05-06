import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { retryWhen, switchMap, throwError, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  get isOnline() {
    return navigator.onLine;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      retryWhen(errors => {
        if (this.isOnline) return errors.pipe(switchMap(err => throwError(err)));
        return throwError({ error: 'Offline' });
      }),
      timeout(10000)
    );
  }
}
