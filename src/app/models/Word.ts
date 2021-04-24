import {IWordDto} from "../interfaces/dto/IWordDto";
import {IWord} from "../interfaces/IWord";
import {ISpeechPart} from "../interfaces/ISpeechPart";
import {IGender} from "../interfaces/IGender";
import {ILanguage} from "../interfaces/ILanguage";
import {IUser} from "../interfaces/IUser";
import {IWordMetadata} from "../interfaces/IWordMetadata";

export class Word implements IWord {
  dbid?: number;
  word?: string;
  translations?: string;
  speechPart?: ISpeechPart;
  gender?: IGender;
  forms?: string;
  originalLanguage?: ILanguage;
  translatedLanguage?: ILanguage;
  remarks?: string;
  stressLetterIndex?: number;
  userCreated?: IUser;

  constructor(wordDto?: IWordDto, wordMetadata?: IWordMetadata, user?: IUser) {
    const speechParts = wordMetadata?.speechParts;
    const genders = wordMetadata?.genders;
    const languages = wordMetadata?.languages;
    this.dbid = wordDto?.id;
    this.word = wordDto?.word;
    this.translations = wordDto?.translations;
    this.forms = wordDto?.forms;
    this.remarks = wordDto?.remarks;
    this.stressLetterIndex = wordDto?.stress_letter_index;
    this.speechPart = speechParts?.find(sp => sp.id === wordDto?.speech_part_id);
    this.gender = genders?.find(g => g.id === wordDto?.gender_id);
    this.originalLanguage = languages?.find(l => l.id === wordDto?.original_language_id);
    this.translatedLanguage = languages?.find(l => l.id === wordDto?.translated_language_id);
    this.userCreated = user;
  }
}
