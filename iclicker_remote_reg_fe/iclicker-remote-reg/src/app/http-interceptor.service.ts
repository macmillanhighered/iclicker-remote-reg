import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { _throw as throwError } from 'rxjs/observable/throw';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor{

  intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse) => {
        // we can return a generic error-dialog also from here
        console.log(error.message)
        alert("A server error occured :: " + error.message);
        return throwError(error)
      })
    )
  }

  constructor() { }
}
