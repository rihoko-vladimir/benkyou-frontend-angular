import {Injectable} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {catchError, mergeMap, Observable, throwError} from "rxjs";
import {AppConfiguration} from "../Constants/AppConfiguration";

@Injectable()


export class JwtRefreshInterceptor implements HttpInterceptor{
  constructor(private httpClient : HttpClient, private appConfig: AppConfiguration) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401){
            return this.refreshTokens()
              .pipe(
                mergeMap(() => next.handle(req))
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
