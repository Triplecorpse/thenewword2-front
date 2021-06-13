import {ILanguage} from '../interfaces/ILanguage';

export class User {
  static login: string;
  static token: string;
  static email: string;
  static password: string;
  static nativeLanguage: ILanguage;
  static learningLanguages: ILanguage[];
}
