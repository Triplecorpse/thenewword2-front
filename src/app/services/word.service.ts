import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IWord} from '../interfaces/IWord';
import {map} from 'rxjs/operators';
import {IWordDto} from '../interfaces/dto/IWordDto';
import {UserService} from './user.service';
import {Word} from '../models/Word';
import {IUser} from '../interfaces/IUser';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {IWordCheck} from '../interfaces/IWordCheck';
import {IWordCheckDto} from '../interfaces/dto/IWordCheckDto';
import {MetadataService} from './metadata.service';
import {IWordSet} from "../interfaces/IWordSet";
import {IWordSetDto} from "../interfaces/dto/IWordSetDto";
import {WordSet} from "../models/WordSet";

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

  getWordSets$(): Observable<IWordSet[]> {
    return this.httpClient.get<IWordSetDto[]>('wordset/get')
      .pipe(map(wordSetsDto => wordSetsDto.map(wordSetDto => this.wordSetFromDto(wordSetDto))));
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

  addOrModifyWordSet(wordSet: IWordSet): Observable<void> {
    if (wordSet.id) {
      return this.httpClient.put('wordset/edit', this.dtoFromWordSet(wordSet))
        .pipe(map(() => {
        }));
    }

    return this.httpClient.post('wordset/add', this.dtoFromWordSet(wordSet))
      .pipe(map(() => {
      }));
  }

  remove(id: number): Observable<void> {
    return this.httpClient.delete('word/remove', {params: {id: id.toString()}})
      .pipe(map(() => {}));
  }

  removeWordset(id: number): Observable<void> {
    return this.httpClient.delete('wordset/remove', {params: {id: id.toString()}})
      .pipe(map(() => {}));
  }

  wordFromDto(wordDto: IWordDto): IWord {
    return new Word(wordDto, this.metadataService.metadata, this.userService.getUser() as IUser);
  }

  wordSetFromDto(wordSetDto: IWordSetDto): IWordSet {
    return new WordSet(wordSetDto);
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

  dtoFromWordSet(wordSet: IWordSet): IWordSetDto {
    return {
      id: wordSet.id,
      name: wordSet.name,
      original_language_id: wordSet.originalLanguage.id,
      translated_language_id: wordSet.translatedlanguage.id
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
