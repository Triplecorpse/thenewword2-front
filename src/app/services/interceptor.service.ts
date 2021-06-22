import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from './user.service';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  static errorCodes: {[key: string]: string};
  unhandledError = 'Сталася невідома помилка при запиті: ';

  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              @Inject(PLATFORM_ID) private platformId: string) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userService.getUser()?.token ? this.userService.getUser()?.token : '';
    const exclusions: RegExp[] = [/(.json)$/];
    let url = req.url;
    let newReq;
    const replaceUrlByExclusion = exclusions.map(exclusion => exclusion.test(url)).some(result => !!result);

    if (!req.url.startsWith('http://') && !req.url.startsWith('https://') && !replaceUrlByExclusion) {
      url = `${environment.api}/${url}`;
    }

    if (replaceUrlByExclusion && isPlatformServer(this.platformId)) {
      url = `${environment.baseUrl}${url}`;
    }

    if (token) {
      newReq = req.clone({url, setParams: {token}, setHeaders: {Authorization: `Bearer ${token}`}});
    } else {
      newReq = req.clone({url});
    }

    return next.handle(newReq)
      .pipe(
        catchError(error => {
          if (InterceptorService.errorCodes && InterceptorService.errorCodes[error?.error?.name]) {
            this.snackBar.open(InterceptorService.errorCodes[error.error.name], '', {duration: 10000});
          } else {
            this.snackBar.open(this.unhandledError + url, '', {duration: 10000});
          }

          return throwError(error);
        })
      );
  }
}
