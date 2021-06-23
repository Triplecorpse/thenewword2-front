import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
import {IWordSet} from '../interfaces/IWordSet';
import {IWordSetDto} from '../interfaces/dto/IWordSetDto';
import {WordSet} from '../models/WordSet';
import {IFilterFormValue} from "../pages/exercise/exercise.component";

export interface IWordFilterData {
  word?: string;
  translations?: string;
  speech_part_id?: number;
  gender_id?: number;
  original_language_id?: number;
  translated_language_id?: number;
  remarks?: string;
  word_set_id?: number;
}


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

  getWords$(filter: IWordFilterData = {}): Observable<IWord[]> {
    const params = new HttpParams({fromObject: {...filter as any}});

    return this.httpClient.get<IWordDto[]>('word/get', {params})
      .pipe(map(wordsDto => wordsDto.map(wordDto => this.wordFromDto(wordDto))));
  }

  getWordSets$(): Observable<IWordSet[]> {
    return this.httpClient.get<IWordSetDto[]>('wordset/get')
      .pipe(map(wordSetsDto => wordSetsDto.map(wordSetDto => this.wordSetFromDto(wordSetDto))));
  }

  addOrModifyWord(word: IWord, wordSetId?: number): Observable<IWord> {
    if (word.dbid) {
      return this.httpClient.put<IWordDto>('word/edit', this.dtoFromWord(word, wordSetId))
        .pipe(map(wordDto => this.wordFromDto(wordDto)));
    }

    return this.httpClient.post<IWordDto>('word/add', this.dtoFromWord(word, wordSetId))
      .pipe(map(wordDto => this.wordFromDto(wordDto)));
  }

  addOrModifyWordSet(wordSet: IWordSet): Observable<IWordSet> {
    if (wordSet.id) {
      return this.httpClient.put<IWordSetDto>('wordset/edit', this.dtoFromWordSet(wordSet))
        .pipe(
          map(wordSetDto => this.wordSetFromDto(wordSetDto))
        );
    }

    return this.httpClient.post<IWordSetDto>('wordset/add', this.dtoFromWordSet(wordSet))
      .pipe(
        map(wordSetDto => this.wordSetFromDto(wordSetDto))
      );
  }

  remove(id: number): Observable<void> {
    return this.httpClient.delete('word/remove', {params: {id: id.toString()}})
      .pipe(map(() => {
      }));
  }

  removeWordset(id: number): Observable<void> {
    return this.httpClient.delete('wordset/remove', {params: {id: id.toString()}})
      .pipe(map(() => {
      }));
  }

  wordFromDto(wordDto: IWordDto): IWord {
    return new Word(wordDto, this.userService.getUser() as IUser);
  }

  wordSetFromDto(wordSetDto: IWordSetDto): IWordSet {
    return new WordSet(wordSetDto);
  }

  dtoFromWord(word: IWord, wordSetId?: number): IWordDto {
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
      gender_id: word.gender?.id,
      transcription: word.transcription,
      word_set_id: wordSetId
    };
  }

  dtoFromWordSet(wordSet: IWordSet): IWordSetDto {
    return {
      id: wordSet.id,
      name: wordSet.name,
      original_language_id: wordSet.originalLanguage?.id,
      translated_language_id: wordSet.translatedlanguage?.id,
      words_count: wordSet.wordsCount
    };
  }

  getWordsToLearn(filter: IFilterFormValue): Observable<IWord[]> {
    const params: {[key: string]: string} = {};

    Object.keys(filter).forEach(key => {
      if (Array.isArray((filter as any)[key])) {
        params[key] = (filter as any)[key].join(',');
      } else {
        params[key] = (filter as any)[key].toString();
      }
    });

    return this.httpClient.get<IWordDto[]>('word/exercise', {params})
      .pipe(map(wordsDto => wordsDto.map(wordDto => this.wordFromDto(wordDto))));
  }

  checkWord(word: IWord, skipCheck?: boolean): Observable<IWordCheck> {
    return this.httpClient.post<IWordCheckDto>('word/exercise',
      {
        skipped: skipCheck,
        settings: {},
        word: this.dtoFromWord(word)
      })
      .pipe(map(response => ({
        isRight: response.right,
        vault: this.wordFromDto(response.vault),
        you: this.wordFromDto(response.you),
        status: response.status,
        diff: response.diff
      })));
  }
}
