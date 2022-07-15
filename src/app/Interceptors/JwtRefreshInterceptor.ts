import {Injectable} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {catchError, EMPTY, mergeMap, Observable, throwError} from "rxjs";
import {AppConfiguration} from "../Constants/AppConfiguration";
import AppState from "../Redux/app.state";
import {Store} from "@ngrx/store";
import {logout} from "../Redux/Actions/account.actions";
import {Router} from "@angular/router";

@Injectable()


export class JwtRefreshInterceptor implements HttpInterceptor{
  constructor(private httpClient : HttpClient, private appConfig: AppConfiguration, private store : Store<AppState>, private router : Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401){
            return this.refreshTokens()
              .pipe(
                mergeMap(() => next.handle(req)),
                catchError(() => {
                  this.store.dispatch(logout())
                  this.router.navigate(["auth"])
                  return EMPTY
                })
              )
          }
          return throwError(error)
        })
      )
  }

  refreshTokens(){
    console.log("refreshing")
    return this.httpClient.post<any>(`${this.appConfig.apiEndpoint}/auth/refresh`, {}, {
      withCredentials: true
    })
  }

}
