import {ILanguage} from '../interfaces/ILanguage';
import {IGender} from '../interfaces/IGender';
import {ISpeechPart} from '../interfaces/ISpeechPart';
import {IWordMetadata} from '../interfaces/IWordMetadata';

export class Metadata {
  static languages: ILanguage[] = [];
  static genders: IGender[] = [];
  static speechParts: ISpeechPart[] = [];
}
