import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private userService: UserService, private snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userService.getUser()?.token ? this.userService.getUser()?.token : '';
    const params = req.params;
    let url = req.url;
    let newReq;

    if (token) {
      params.append('token', token as string);
    }

    if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
      url = `${environment.api}/${url}`;
    }

    if (token) {
      newReq = req.clone({url, setParams: {token}});
    } else {
      newReq = req.clone({url});
    }

    return next.handle(newReq)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            this.snackBar.open(`Bad credentials or token, please try to relogin`, '', {duration: 10000});
          } else {
            this.snackBar.open(`An error '${error.error.type}' occurred to your request.`, '', {duration: 10000});
          }

          return throwError(error);
        })
      );
  }
}
