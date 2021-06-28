import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {Observable, ReplaySubject} from 'rxjs';
import {IUser} from '../interfaces/IUser';
import {HttpClient} from '@angular/common/http';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {IUserDto} from '../interfaces/dto/IUserDto';
import {MetadataService} from './metadata.service';
import {User} from '../models/User';
import {Metadata} from "../models/Metadata";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$ = new ReplaySubject<IUser | null>(1);
  private user: IUser | null = null;
  isServer: boolean;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private httpClient: HttpClient,
              private recaptchaV3Service: ReCaptchaV3Service,
              private metadataService: MetadataService,
              private router: Router) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
    this.user = this.getUser();
    this.user$.next(this.getUser());

    this.setUserStatic();
  }

  getUser$(): Observable<IUser | null> {
    return this.user$.asObservable();
  }

  setUser(user: IUser, saveSession: boolean) {
    if (this.isBrowser) {
      if (saveSession) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('save-session', 'true');
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    }

    this.user = user;

    this.setUserStatic();
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

    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user') as string);
    }

    return null;
  }

  login(user: IUser, saveSession: boolean): Observable<IUser> {
    return this.recaptchaV3Service.execute('importantAction')
      .pipe(
        switchMap(token => this.httpClient.post<IUserDto>('user/login', {...user, token})),
        map<IUserDto, IUser>(res => ({
          login: res.login,
          email: res.email,
          password: res.password,
          nativeLanguages: Metadata.languages.filter(lang => res.native_languages.includes(lang.id)),
          learningLanguages: Metadata.languages.filter(lang => res.learning_languages.includes(lang.id)),
          token: res.token
        })),
        tap(res => {
          this.setUser(res, saveSession);
          this.user$.next(this.getUser());
          this.router.navigate(['dashboard']);
        })
      );
  }

  register(user: IUser): Observable<void> {
    const userDto: IUserDto = {
      login: user.login,
      learning_languages: user.learningLanguages?.map(({id}) => id),
      native_languages: user.nativeLanguages.map(({id}) => id),
      email: user.email,
      password: user.password
    };

    return this.recaptchaV3Service.execute('importantAction')
      .pipe(
        switchMap(token => this.httpClient.post<void>('user/register', {...userDto, token})),
      );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('save-session');
      sessionStorage.removeItem('user');
      this.user$.next();
      this.router.navigate(['']);
    }
  }

  update(user: IUser, newPassword?: string): Observable<IUser> {
    const userDto: IUserDto = {
      email: user.email || undefined,
      password: user.password,
      new_password: newPassword,
      login: user.login,
      learning_languages: user.learningLanguages.map(lang => lang.id)
    };

    return this.httpClient.post<IUserDto>('user/modify', userDto)
      .pipe(
        map<IUserDto, IUser>(res => ({
          login: res.login,
          email: res.email,
          password: res.password,
          nativeLanguages: Metadata.languages.filter(lang => res.native_languages.includes(lang.id)),
          learningLanguages: Metadata.languages.filter(lang => res.learning_languages.includes(lang.id)),
          token: res.token
        })),
        tap(newUser => {
          this.setUser(newUser, localStorage.getItem('save-session') === 'true');
          this.user$.next(this.getUser());

          if (newPassword) {
            this.logout();
          }
        })
      );
  }

  private setUserStatic() {
    User.login = this.user?.login;
    User.token = this.user?.token;
    User.email = this.user?.email;
    User.password = this.user?.password;
    User.nativeLanguages = this.user?.nativeLanguages;
    User.learningLanguages = this.user?.learningLanguages;
  }
}
