import {ISpeechPart} from './ISpeechPart';
import {IGender} from './IGender';
import {ILanguage} from './ILanguage';
import {IUser} from './IUser';
import {ITimeInterval} from "./ITimeInterval";

export interface IWord {
  dbid?: number;
  word?: string;
  translations?: string[];
  speechPart?: ISpeechPart;
  gender?: IGender;
  forms?: string[];
  originalLanguage?: ILanguage;
  translatedLanguage?: ILanguage;
  remarks?: string;
  stressLetterIndex?: number;
  userCreated?: IUser;
  transcription?: string;
  threshold?: number;
  timesInExercise?: number;
  lastIssued?: ITimeInterval;
}
