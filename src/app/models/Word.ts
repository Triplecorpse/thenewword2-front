import {IWordDto} from '../interfaces/dto/IWordDto';
import {IWord} from '../interfaces/IWord';
import {ISpeechPart} from '../interfaces/ISpeechPart';
import {IGender} from '../interfaces/IGender';
import {ILanguage} from '../interfaces/ILanguage';
import {IUser} from '../interfaces/IUser';
import {IWordMetadata} from '../interfaces/IWordMetadata';
import {Metadata} from './Metadata';
import {User} from './User';

export class Word implements IWord {
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
  transcription: string;

  constructor(wordDto?: IWordDto, user?: IUser) {
    user = user || User;

    const speechParts = Metadata.speechParts;
    const genders = Metadata.genders;
    const languages = Metadata.languages;
    this.dbid = wordDto?.id;
    this.word = wordDto?.word;
    this.translations = wordDto?.translations;
    this.transcription = wordDto?.transcription;
    this.forms = wordDto?.forms;
    this.remarks = wordDto?.remarks;
    this.stressLetterIndex = wordDto?.stress_letter_index;
    this.speechPart = speechParts?.find(sp => sp.id === wordDto?.speech_part_id);
    this.gender = genders?.find(g => g.id === wordDto?.gender_id);
    this.originalLanguage = languages?.find(l => l.id === wordDto?.original_language_id);
    this.translatedLanguage = languages?.find(l => l.id === wordDto?.translated_language_id);
    this.userCreated = user;
  }

  convertToDto(): IWordDto {
    return {
      id: this.dbid,
      word: this.word,
      forms: this.forms,
      gender_id: this.gender.id,
      remarks: this.remarks,
      original_language_id: this.originalLanguage.id,
      speech_part_id: this.speechPart.id,
      stress_letter_index: this.stressLetterIndex,
      translated_language_id: this.translatedLanguage.id,
      translations: this.translations,
      transcription: this.transcription
    };
  }
}
