import {ILanguage} from '../interfaces/ILanguage';

export class User {
  static login: string;
  static token: string;
  static email: string;
  static password: string;
  static nativeLanguages: ILanguage[];
  static learningLanguages: ILanguage[];
}
