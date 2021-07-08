import {ISpeechPart} from './ISpeechPart';
import {IGender} from './IGender';
import {ILanguage} from './ILanguage';
import {ISymbol} from "./ISymbol";

export interface IWordMetadata {
  speechParts: ISpeechPart[];
  genders: IGender[];
  languages: ILanguage[];
  symbols: ISymbol[];
}
