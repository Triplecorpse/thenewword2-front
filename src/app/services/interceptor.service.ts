import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from './user.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userService.getUser()?.token ? this.userService.getUser()?.token : '';
    const params = req.params;
    const exclusions: RegExp[] = [/(.json)$/];
    let url = req.url;
    let newReq;
    const replaceUrlByExclusion = exclusions.map(exclusion => exclusion.test(url)).some(result => !!result);

    if (token) {
      params.append('token', token as string);
    }

    if (!req.url.startsWith('http://') && !req.url.startsWith('https://') && !replaceUrlByExclusion) {
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
          const translateService = this.injector.get(TranslateService);

          translateService.get(`ERROR_CODES.${error.error.name}`)
            .subscribe(message => {
              if (message) {
                this.snackBar.open(message, '', {duration: 10000});
              } else {
                this.snackBar.open(`An error occurred to your request.`, '', {duration: 10000});
              }
            });

          return throwError(error);
        })
      );
  }
}
