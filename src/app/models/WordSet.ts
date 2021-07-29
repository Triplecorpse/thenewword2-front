import {IWordSet} from '../interfaces/IWordSet';
import {IWordSetDto} from '../interfaces/dto/IWordSetDto';
import {Word} from './Word';
import {ILanguage} from "../interfaces/ILanguage";
import {Metadata} from "./Metadata";

export class WordSet implements IWordSet {
  id: number;
  name: string;
  words: Word[] = [];
  foreignLanguage: ILanguage;
  nativeLanguage: ILanguage;
  wordsCount: number;

  constructor(wordSetDto?: IWordSetDto) {
    this.id = wordSetDto?.id;
    this.name = wordSetDto?.name;
    this.foreignLanguage = Metadata.languages.find(({id}) => id === wordSetDto?.foreign_language_id);
    this.nativeLanguage = Metadata.languages.find(({id}) => id === wordSetDto?.native_language_id);
    this.wordsCount = wordSetDto?.words_count;
  }

  convertToDto(): IWordSetDto {
    return {
      id: this.id,
      name: this.name,
      foreign_language_id: this.foreignLanguage.id,
      native_language_id: this.nativeLanguage.id
    };
  }
}
