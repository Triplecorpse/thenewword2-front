import {ILanguage} from './ILanguage';

export interface IUser {
  id?: number;
  login?: string;
  token?: string;
  email?: string;
  password?: string;
  nativeLanguages?: ILanguage[];
  learningLanguages?: ILanguage[];
}
