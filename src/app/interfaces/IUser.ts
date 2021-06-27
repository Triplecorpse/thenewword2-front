import {ILanguage} from './ILanguage';

export interface IUser {
  login?: string;
  token?: string;
  email?: string;
  password?: string;
  nativeLanguages?: ILanguage[];
  learningLanguages?: ILanguage[];
}
