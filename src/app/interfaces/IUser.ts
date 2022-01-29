import {ILanguage} from './ILanguage';

export interface IUser {
  id?: number;
  login?: string;
  token?: string;
  refresh?: string;
  email?: string;
  password?: string;
  nativeLanguages?: ILanguage[];
  learningLanguages?: ILanguage[];
  mapCyrillic?: boolean;
}
