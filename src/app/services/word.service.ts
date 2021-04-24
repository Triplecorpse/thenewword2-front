import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {IWord} from "../interfaces/IWord";
import {map, tap} from "rxjs/operators";
import {IWordDto} from "../interfaces/dto/IWordDto";
import {IWordMetadataDto} from "../interfaces/dto/IWordMetadataDto";
import {IWordMetadata} from "../interfaces/IWordMetadata";
import {UserService} from "./user.service";
import {Word} from "../models/Word";
import {IUserDto} from "../interfaces/dto/IUserDto";
import {IUser} from "../interfaces/IUser";

@Injectable({
  providedIn: 'root'
})
export class WordService {
  wordMetadata: IWordMetadata;

  constructor(private httpClient: HttpClient, private userService: UserService) {
  }

  getWords(): Observable<IWordDto> {
    return this.httpClient.get<IWordDto>('word/get');
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

  addWord(word: IWord): Observable<void> {
    console.log(word);
    return this.httpClient.post('word/add', this.dtoFromWord(word))
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
    }
  }
}
