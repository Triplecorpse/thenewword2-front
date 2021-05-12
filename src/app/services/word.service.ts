import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {combineLatest, Observable, of} from 'rxjs';
import {IWord} from '../interfaces/IWord';
import {map, switchMap, tap} from 'rxjs/operators';
import {IWordDto} from '../interfaces/dto/IWordDto';
import {IWordMetadataDto} from '../interfaces/dto/IWordMetadataDto';
import {IWordMetadata} from '../interfaces/IWordMetadata';
import {UserService} from './user.service';
import {Word} from '../models/Word';
import {IUser} from '../interfaces/IUser';
import {IGender} from '../interfaces/IGender';
import {ISpeechPart} from '../interfaces/ISpeechPart';
import {ILanguage} from '../interfaces/ILanguage';
import {isPlatformBrowser, isPlatformServer} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class WordService {
  wordMetadata: IWordMetadata;
  isServer: boolean;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private httpClient: HttpClient,
              private userService: UserService) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getWords$(): Observable<IWord[]> {
    return this.httpClient.get<IWordDto[]>('word/get')
      .pipe(switchMap(wordsDto => {
        const words$ = wordsDto.map(wordDto => this.wordFromDto(wordDto));

        return combineLatest(words$);
      }));
  }

  getWordMetadata$(): Observable<IWordMetadata> {
    if (this.wordMetadata) {
      return of(this.wordMetadata);
    }

    return this.httpClient.get<IWordMetadataDto>('word/metadata')
      .pipe(
        map<IWordMetadataDto, IWordMetadata>(result => ({
          speechParts: result.speechParts.map(sp => ({id: sp.id, englishName: sp.title})),
          languages: result.languages.map(l => ({id: l.id, englishName: l.title})),
          genders: result.genders.map(g => ({id: g.id, englishName: g.title}))
        })),
        tap(result => {
          this.wordMetadata = result;
        }));
  }

  getGenderById(id: number): IGender {
    if (!this.wordMetadata) {
      return null;
    }

    return this.wordMetadata.genders.find(g => g.id === id);
  }

  getSpeechPartById(id: number): ISpeechPart {
    if (!this.wordMetadata) {
      return null;
    }

    return this.wordMetadata.speechParts.find(g => g.id === id);
  }

  getLanguageById(id: number): ILanguage {
    if (!this.wordMetadata) {
      return null;
    }

    return this.wordMetadata.languages.find(g => g.id === id);
  }

  addOrModifyWord(word: IWord): Observable<void> {
    if (word.dbid) {
      return this.httpClient.put('word/edit', this.dtoFromWord(word))
        .pipe(map(() => {
        }));
    }

    return this.httpClient.post('word/add', this.dtoFromWord(word))
      .pipe(map(() => {
      }));
  }

  remove(id: number): Observable<void> {
    return this.httpClient.delete('word/remove', {params: {id: id.toString()}})
      .pipe(map(() => {
      }));
  }

  wordFromDto(wordDto: IWordDto): Observable<IWord> {
    return this.getWordMetadata$()
      .pipe(map(metadata => new Word(wordDto, metadata, this.userService.getUser() as IUser)));
  }

  dtoFromWord(word: IWord): IWordDto {
    return {
      word: word.word,
      translated_language_id: word.translatedLanguage?.id,
      original_language_id: word.originalLanguage?.id,
      stress_letter_index: word.stressLetterIndex,
      remarks: word.remarks,
      speech_part_id: word.speechPart?.id,
      translations: word.translations,
      id: word.dbid,
      forms: word.forms,
      gender_id: word.gender?.id
    };
  }

  getWordsToLearn(): Observable<IWord[]> {
    return this.httpClient.get<{ words: IWordDto[], encoded: string }>('word/exercise')
      .pipe(switchMap(({words: wordsDto, encoded}) => {
        const words$ = wordsDto.map(wordDto => this.wordFromDto(wordDto));

        if (this.isBrowser) {
          sessionStorage.setItem('wordsToLearn', encoded);
        }

        return combineLatest(words$);
      }));
  }

  checkWord(word: IWord): Observable<boolean> {
    return this.httpClient.post('word/exercise',
      {
        encoded: sessionStorage.getItem('wordsToLearn'),
        word: this.dtoFromWord(word)
      })
      .pipe(map(response => {
        console.log(response);

        return !!response;
      }));
  }
}
