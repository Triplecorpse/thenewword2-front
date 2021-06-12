import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ILanguage} from '../interfaces/ILanguage';
import {ISpeechPart} from '../interfaces/ISpeechPart';
import {IGender} from '../interfaces/IGender';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {IWordMetadataDto} from '../interfaces/dto/IWordMetadataDto';
import {Language} from '../models/Language';
import {SpeechPart} from '../models/SpeechPart';
import {Gender} from '../models/Gender';
import {IWordMetadata} from "../interfaces/IWordMetadata";

@Injectable({
  providedIn: 'root'
})
export class MetadataService implements CanActivate {
  languages: ILanguage[];
  speechParts: ISpeechPart[];
  genders: IGender[];
  metadata: IWordMetadata;

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
            .map(l => new Language(l))
            .sort((a, b) => {
              return a.nativeName > b.nativeName ? 1 : -1;
            });
          this.speechParts = result.speechParts.map(sp => new SpeechPart(sp));
          this.genders = result.genders.map(g => new Gender(g));
          this.metadata = {
            genders: this.genders,
            speechParts: this.speechParts,
            languages: this.languages
          };
        }),
        map(_ => true)
      );
  }
}
