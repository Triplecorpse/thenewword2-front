import {IWord} from './IWord';
import {ILanguage} from "./ILanguage";

export interface IWordSet {
  id: number;
  name: string;
  words: IWord[];
  foreignLanguage: ILanguage;
  nativeLanguage: ILanguage;
  wordsCount: number;
  userIsSubscribed?: boolean;
  userCreatedId?: number;
  isLoading?: boolean;
}
