import {IWordSet} from '../interfaces/IWordSet';
import {IWordSetDto} from '../interfaces/dto/IWordSetDto';
import {Word} from './Word';

export class WordSet implements IWordSet {
  id: number;
  name: string;
  words: Word[] = [];

  constructor(wordSetDto?: IWordSetDto) {
    this.id = wordSetDto?.id;
    this.name = wordSetDto?.name;
    this.words = wordSetDto?.words?.map(wordDto => new Word(wordDto)) || [];
  }

  convertToDto(): IWordSetDto {
    return {
      id: this.id,
      words: this.words.map(w => w.convertToDto()),
      name: this.name
    };
  }
}
