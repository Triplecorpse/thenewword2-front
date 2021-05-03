import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from "@angular/common";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {IUser} from "../interfaces/IUser";
import {HttpClient} from "@angular/common/http";
import {ReCaptchaV3Service} from "ng-recaptcha";
import {switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$ = new ReplaySubject<IUser | null>(1);
  isServer: boolean;
  isBrowser: boolean;
  user: IUser | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private httpClient: HttpClient,
              private recaptchaV3Service: ReCaptchaV3Service,
              private router: Router) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
    this.user = this.getUser();
    this.user$.next(this.getUser());
  }

  getUser$(): Observable<IUser | null> {
    return this.user$.asObservable();
  }

  setUser(user: IUser) {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): IUser | null {
    if (this.isServer) {
      return null;
    }

    if (this.user) {
      return this.user;
    }

    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user') as string);
    }

    return null;
  }

  login(user: IUser): Observable<IUser> {
    return this.recaptchaV3Service.execute('importantAction')
      .pipe(
        switchMap(token => this.httpClient.post<IUser>('user/login', {...user, token})),
        tap(response => {
          this.setUser(response);
          this.user$.next(this.getUser());
          this.router.navigate(['dashboard']);
        })
      );
  }

  register(user: IUser): Observable<void> {
    return this.recaptchaV3Service.execute('importantAction')
      .pipe(
        switchMap(token => this.httpClient.post<void>('user/register', {...user, token})),
      );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('user');
      this.user$.next();
      this.router.navigate(['']);
    }
  }
}
