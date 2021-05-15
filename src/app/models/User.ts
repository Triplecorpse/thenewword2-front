import {IUser} from "../interfaces/IUser";
import {IUserDto} from "../interfaces/dto/IUserDto";
import {ILanguage} from "../interfaces/ILanguage";

export class User implements IUser {
  login: string;
  nativeLanguage: ILanguage;
  learningLanguages: ILanguage[];
  email: string;
  password?: string;
  token?: string;

  constructor(user: IUserDto, languages: ILanguage[]) {
    this.login = user.login;
    this.password = user.password;
    this.learningLanguages = languages.filter(l => user.learning_languages.includes(l.id));
    this.nativeLanguage = la
  }
}
