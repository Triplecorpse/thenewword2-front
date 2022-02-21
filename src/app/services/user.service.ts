import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {iif, Observable, of, ReplaySubject} from 'rxjs';
import {IUser} from '../interfaces/IUser';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {map, switchMap, switchMapTo, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {IUserDto} from '../interfaces/dto/IUserDto';
import {MetadataService} from './metadata.service';
import {User} from '../models/User';
import {Metadata} from '../models/Metadata';
import {ISymbolDto} from '../interfaces/dto/ISymbolDto';
import {ISymbol} from '../interfaces/ISymbol';
import {environment} from '../../environments/environment';
import {IDashboard} from '../interfaces/IDashboard';
import {IDashboardDto} from '../interfaces/dto/IDashboardDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$ = new ReplaySubject<IUser | null>(1);
  private httpStandAloneClient: HttpClient;
  isServer: boolean;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private httpClient: HttpClient,
              private recaptchaV3Service: ReCaptchaV3Service,
              private metadataService: MetadataService,
              private router: Router,
              private handler: HttpBackend) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
    this.user$.next(this.getUser());
    this.httpStandAloneClient = new HttpClient(handler);

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

    this.setUserStatic();
  }

  getUser(): IUser | null {
    if (this.isServer) {
      return null;
    }

    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'));
    }

    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user'));
    }

    return null;
  }

  login(user: IUser, saveSession: boolean): Observable<IUser> {
    return this.recaptchaV3Service.execute('importantAction')
      .pipe(
        switchMap(token => this.httpClient.post<IUserDto>('user/login', {...user, token})),
        map<IUserDto, IUser>(res => ({
          id: res.id,
          login: res.login,
          email: res.email,
          password: res.password,
          nativeLanguages: Metadata.languages.filter(lang => res.native_languages.includes(lang.id)),
          learningLanguages: Metadata.languages.filter(lang => res.learning_languages.includes(lang.id)),
          token: res.token,
          refresh: res.refresh,
          mapCyrillic: res.map_cyrillic
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
      password: user.password,
      map_cyrillic: user.mapCyrillic
    };

    return this.recaptchaV3Service.execute('importantAction')
      .pipe(
        switchMap(token => this.httpClient.post<void>('user/register', {...userDto, token})),
      );
  }

  refreshTokenIfRequired(): Observable<void> {
    if (this.isBrowser) {
      const {token, refresh} = this.getUser() ? this.getUser() : {}!;

      if (!token || !refresh) {
        return of(null);
      }

      const tokenPayload = JSON.parse(atob(token?.split('.')[1]));
      const isExpired = tokenPayload.exp * 1000 <= Date.now();
      const getNewToken = this.httpStandAloneClient.post<{ refresh: string, token: string }>(`${environment.api}/user/refresh`, {
        refresh,
        user_id: this.getUser()?.id
      })
        .pipe(
          tap(({token, refresh}) => {
            this.setUser({...this.getUser(), token, refresh}, localStorage.getItem('save-session') === 'true');
          }),
          switchMapTo(of(null))
        );

      return iif(() => isExpired, getNewToken, of(null));
    }

    return of(null);
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
      id: this.getUser()?.id,
      email: user.email || undefined,
      password: user.password,
      new_password: newPassword,
      login: user.login,
      learning_languages: user.learningLanguages?.map(lang => lang.id),
      native_languages: user.nativeLanguages?.map(lang => lang.id),
      map_cyrillic: user.mapCyrillic
    };

    return this.httpClient.post<IUserDto>('user/modify', userDto)
      .pipe(
        map<IUserDto, IUser>(res => ({
          id: res.id,
          login: res.login,
          email: res.email,
          password: res.password,
          nativeLanguages: Metadata.languages.filter(lang => res.native_languages.includes(lang.id)),
          learningLanguages: Metadata.languages.filter(lang => res.learning_languages.includes(lang.id)),
          token: res.token,
          refresh: this.getUser()?.refresh,
          mapCyrillic: res.map_cyrillic
        })),
        tap(newUser => {
          this.setUser(newUser, localStorage.getItem('save-session') === 'true');
          this.user$.next(this.getUser());
        })
      );
  }

  updateKeyboardSettings(setting: ISymbol): Observable<ISymbol> {
    const settingDto: ISymbolDto = {
      action: setting.action,
      user_id: this.getUser()?.id,
      language_id: setting.lang.id,
      symbols: setting.letters
    };

    return this.httpClient.post<ISymbolDto>('user/modify-keyboard-settings', settingDto)
      .pipe(map((value: ISymbolDto) => ({
        letters: value.symbols,
        lang: Metadata.languages.find(l => l.id === value.language_id),
        action: value.action
      })));
  }

  private setUserStatic() {
    const user = this.getUser();
    User.login = user?.login;
    User.email = user?.email;
    User.password = user?.password;
    User.nativeLanguages = user?.nativeLanguages;
    User.learningLanguages = user?.learningLanguages;
    User.id = user?.id;
    User.mapCyrillic = user?.mapCyrillic;
  }

  getDashboard$(): Observable<IDashboard> {
    return this.httpClient.get<IDashboardDto>('user/statistics')
      .pipe(
        map<IDashboardDto, IDashboard>(result => ({
          accountCreated: new Date(result.account_created),
          exercisesPassed: result.exercises_passed,
          myLearnedLanguages: result.my_learned_languages,
          myNativeLanguage: result.my_native_languages,
          mySubscribedWordsets: result.my_subscribed_wordsets,
          myWordsets: result.my_wordsets,
          otherSubscribedWordsets: result.other_subscribed_wordsets,
          wordsRight: result.words_right,
          wordsWrong: result.words_wrong,
          wordsSkipped: result.words_skipped,
          words80: result.words_80
        }))
      );
  }
}
