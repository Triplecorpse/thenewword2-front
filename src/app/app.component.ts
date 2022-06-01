import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {InterceptorService} from './services/interceptor.service';
import {ScreenService} from './services/screen.service';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Spell Master';
  isBrowser = false;
  breakpoints = {
    xs: [0, 575],
    s: [576, 769],
    m: [768, 991],
    l: [992, 1199],
    xl: [1200, 1399],
    xxl: [1400, Infinity]
  };

  @HostListener('window:resize', ['$event'])
  onresize() {
    let size: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' = 'xxl';
    Object.keys(this.breakpoints).forEach((key) => {
      // @ts-ignore
      const value: [number, number] = this.breakpoints[key];

      if (window.innerWidth > value[0] && window.innerWidth < value[1]) {
        size = key as 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
      }
    });
    this.screenService.screen$.next({
      height: window.innerHeight,
      width: window.innerWidth,
      size,
      sizes: ['xs', 's', 'm', 'l', 'xl', 'xxl']
    });
  }

  constructor(private translateService: TranslateService,
              private screenService: ScreenService,
              private route: Router,
              @Inject(PLATFORM_ID) private platformId: string) {
    this.translateService.get('ERROR_CODES')
      .subscribe(result => {
        InterceptorService.errorCodes = result;
      });
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const mode = sessionStorage.getItem('mode');

      this.onresize();

      if (mode) {
        this.route.navigate([mode]);
      }
    }
  }
}
