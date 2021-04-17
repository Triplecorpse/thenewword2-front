import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {DataService} from "./data.service";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private dataService: DataService, private snackBar: MatSnackBar) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.dataService.getToken();
    const headers = req.headers;
    let url = req.url;

    if (token) {
      headers.append('token', token);
    }

    if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
      url = `${environment.api}/${url}`;
    }

    const newReq = req.clone({headers, url});

    return next.handle(newReq)
      .pipe(
        catchError(error => {
          this.snackBar.open(`An error '${error.error.desc}' occurred to the request. Error code: ${error.error.code}`, '',{duration: 10000});

          return throwError(error);
        })
      );
  }
}