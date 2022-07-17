import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, retryWhen, switchMap, throwError, timeout} from "rxjs";

@Injectable()

export class TimeoutInterceptor implements HttpInterceptor{

  get isOnline() {
    return navigator.onLine;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(errors => {
        if (this.isOnline)
          return errors.pipe(switchMap(err => throwError(err)));
        return throwError({error : "Offline"})
      }),
      timeout(10000)
    )
  }
}
