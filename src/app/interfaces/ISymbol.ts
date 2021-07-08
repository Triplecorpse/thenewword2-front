import {ILanguage} from "./ILanguage";

export interface ISymbol {
  lang: ILanguage;
  letters: string[];
  action?: 'add' | 'remove';
}
