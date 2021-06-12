import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {combineLatest, Observable, of} from 'rxjs';
import {IWord} from '../interfaces/IWord';
import {map, switchMap, tap} from 'rxjs/operators';
import {IWordDto} from '../interfaces/dto/IWordDto';
import {UserService} from './user.service';
import {Word} from '../models/Word';
import {IUser} from '../interfaces/IUser';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {IWordCheck} from '../interfaces/IWordCheck';
import {IWordCheckDto} from '../interfaces/dto/IWordCheckDto';
import {MetadataService} from './metadata.service';
import {IWordMetadata} from "../interfaces/IWordMetadata";

@Injectable({
  providedIn: 'root'
})
export class WordService {
  isServer: boolean;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private httpClient: HttpClient,
              private userService: UserService,
              private metadataService: MetadataService) {
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getWords$(): Observable<IWord[]> {
    return this.httpClient.get<IWordDto[]>('word/get')
      .pipe(map(wordsDto => wordsDto.map(wordDto => this.wordFromDto(wordDto))));
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
      .pipe(map(() => {}));
  }

  wordFromDto(wordDto: IWordDto): IWord {
    return new Word(wordDto, this.metadataService.metadata, this.userService.getUser() as IUser);
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
      .pipe(map(({words: wordsDto, encoded}) => {
        const words = wordsDto.map(wordDto => this.wordFromDto(wordDto));

        if (this.isBrowser) {
          sessionStorage.setItem('wordsToLearn', encoded);
        }

        return words;
      }));
  }

  checkWord(word: IWord): Observable<IWordCheck> {
    return this.httpClient.post<IWordCheckDto>('word/exercise',
      {
        encoded: sessionStorage.getItem('wordsToLearn'),
        word: this.dtoFromWord(word)
      })
      .pipe(map(response => ({
        isRight: response.right,
        vault: this.wordFromDto(response.vault),
        you: this.wordFromDto(response.you)
      })));
  }
}
