import {ILanguage} from '../interfaces/ILanguage';
import {IGender} from '../interfaces/IGender';
import {ISpeechPart} from '../interfaces/ISpeechPart';
import {ISymbol} from "../interfaces/ISymbol";

export class Metadata {
  static languages: ILanguage[] = [];
  static genders: IGender[] = [];
  static speechParts: ISpeechPart[] = [];
  static symbols: ISymbol[] = [];
}
