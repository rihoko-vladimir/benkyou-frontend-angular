import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Fallback shown to the user when the backend did not return a string message.
 */
export const DEFAULT_ERROR_MESSAGE = 'Service unavailable';

/**
 * Single error normalization point: every HTTP failure leaves the interceptor
 * chain as an HttpErrorResponse whose `.error` is a user-facing string
 * (the backend message when it was one, otherwise {@link DEFAULT_ERROR_MESSAGE}).
 *
 * The response shape is preserved (status/statusText/url) so upstream consumers
 * like JwtRefreshInterceptor can keep reasoning about the original failure.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(catchError(error => throwError(() => normalizeHttpError(error))));
  }
}

function normalizeHttpError(error: unknown): HttpErrorResponse {
  if (error instanceof HttpErrorResponse) {
    const message = typeof error.error === 'string' && error.error.length > 0 ? error.error : DEFAULT_ERROR_MESSAGE;
    return new HttpErrorResponse({
      error: message,
      status: error.status,
      statusText: error.statusText,
      url: error.url ?? undefined
    });
  }

  // Non-HttpErrorResponse failures (e.g. TimeoutInterceptor's `{ error: 'Offline' }`).
  if (isErrorObjectWithStringMessage(error)) {
    return new HttpErrorResponse({ error: error.error, status: 0 });
  }

  return new HttpErrorResponse({ error: DEFAULT_ERROR_MESSAGE, status: 0 });
}

function isErrorObjectWithStringMessage(error: unknown): error is { error: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as { error: unknown }).error === 'string'
  );
}
