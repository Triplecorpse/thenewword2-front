import {IWord} from './IWord';
import {ILanguage} from "./ILanguage";

export interface IWordSet {
  id: number;
  name: string;
  words: IWord[];
  originalLanguage: ILanguage;
  translatedlanguage: ILanguage;
}
