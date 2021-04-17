import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  isServer: boolean;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    this.isServer = isPlatformServer(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(PLATFORM_ID);
  }

  setToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('atoken', token);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('atoken');
    }

    return null;
  }
}
