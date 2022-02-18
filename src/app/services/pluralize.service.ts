import {TranslateService} from "@ngx-translate/core";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PluralizeService {
  constructor(private translateService: TranslateService) {

  }

  pluralize(translatePath: string, number: number, args: any = {}): Observable<string> {
    if (number === 0) {
      return this.translateService.get(`${translatePath}.NO`, args);
    }

    const lastDigit = number % 10;
    const last2Digit = number % 100;

    return this.translateService.get(`${translatePath}.${last2Digit}`, args)
      .pipe(
        switchMap(label => {
          if (label === `${translatePath}.${last2Digit}`) {
            return this.translateService.get(`${translatePath}.${lastDigit}`, args);
          }

          return of(label);
        }),
        map(label => `${number} ${label}`)
      );
  }
}
