import {ISpeechPart} from "./ISpeechPart";
import {IGender} from "./IGender";
import {ILanguage} from "./ILanguage";

export interface IWordMetadata {
  speechParts: ISpeechPart[],
  genders: IGender[],
  languages: ILanguage[]
}
