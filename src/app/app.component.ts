import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {InterceptorService} from './services/interceptor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Spell Master';

  constructor(private translateService: TranslateService) {
    this.translateService.get('ERROR_CODES')
      .subscribe(result => {
        InterceptorService.errorCodes = result;
      });
  }
}
