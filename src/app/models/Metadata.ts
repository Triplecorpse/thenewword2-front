import {ILanguage} from '../interfaces/ILanguage';
import {IGender} from '../interfaces/IGender';
import {ISpeechPart} from '../interfaces/ISpeechPart';

export class Metadata {
  static languages: ILanguage[] = [];
  static genders: IGender[] = [];
  static speechParts: ISpeechPart[] = [];
}
