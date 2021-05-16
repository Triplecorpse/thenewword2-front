import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ILanguage} from '../interfaces/ILanguage';
import {ISpeechPart} from '../interfaces/ISpeechPart';
import {IGender} from '../interfaces/IGender';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {IWordMetadataDto} from '../interfaces/dto/IWordMetadataDto';

@Injectable({
  providedIn: 'root'
})
export class MetadataService implements CanActivate {
  languages: ILanguage[];
  speechParts: ISpeechPart[];
  genders: IGender[];

  constructor(private httpClient: HttpClient) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.languages) {
      return of(true);
    }

    return this.httpClient.get<IWordMetadataDto>('word/metadata')
      .pipe(
        tap(result => {
          this.languages = result.languages
            .map(l => ({id: l.id, englishName: l.title}))
            .sort((a, b) => {
              return a.englishName > b.englishName ? 1 : -1;
            });
          this.speechParts = result.speechParts.map(sp => ({id: sp.id, englishName: sp.title}));
          this.genders = result.genders.map(g => ({id: g.id, englishName: g.title}));
        }),
        map(_ => true)
      );
  }
}
