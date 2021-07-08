import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
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
import {IWordMetadata} from '../interfaces/IWordMetadata';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {Metadata} from '../models/Metadata';

@Injectable({
  providedIn: 'root'
})
export class MetadataService implements CanActivate {
  languages: ILanguage[];
  speechParts: ISpeechPart[];
  genders: IGender[];
  metadata: IWordMetadata;
  isServer: boolean;
  isBrowser: boolean;

  constructor(private httpClient: HttpClient,
              @Inject(PLATFORM_ID) private platformId: string) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
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
            .sort((a, b) => a.nativeName > b.nativeName ? 1 : -1);
          this.speechParts = result.speechParts.map(sp => new SpeechPart(sp));
          this.genders = result.genders.map(g => new Gender(g));
          this.metadata = {
            genders: this.genders,
            speechParts: this.speechParts,
            languages: this.languages,
            symbols: result.symbols.map(s => ({
              lang: this.languages.find(l => l.id === s.language_id),
              letters: s.symbols
            }))
          };
          Metadata.languages = this.languages;
          Metadata.genders = this.genders;
          Metadata.speechParts = this.speechParts;
          Metadata.symbols = this.metadata.symbols;
        }),
        map(_ => true)
      );
  }
}
