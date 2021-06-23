import {IWordSet} from '../interfaces/IWordSet';
import {IWordSetDto} from '../interfaces/dto/IWordSetDto';
import {Word} from './Word';
import {ILanguage} from "../interfaces/ILanguage";
import {Metadata} from "./Metadata";

export class WordSet implements IWordSet {
  id: number;
  name: string;
  words: Word[] = [];
  originalLanguage: ILanguage;
  translatedlanguage: ILanguage;
  wordsCount: number;

  constructor(wordSetDto?: IWordSetDto) {
    this.id = wordSetDto?.id;
    this.name = wordSetDto?.name;
    this.originalLanguage = Metadata.languages.find(({id}) => id === wordSetDto?.original_language_id);
    this.translatedlanguage = Metadata.languages.find(({id}) => id === wordSetDto?.translated_language_id);
    this.wordsCount = wordSetDto?.words_count;
  }

  convertToDto(): IWordSetDto {
    return {
      id: this.id,
      name: this.name,
      original_language_id: this.originalLanguage.id,
      translated_language_id: this.translatedlanguage.id
    };
  }
}
