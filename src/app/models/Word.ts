import {IWordDto} from '../interfaces/dto/IWordDto';
import {IWord} from '../interfaces/IWord';
import {ISpeechPart} from '../interfaces/ISpeechPart';
import {IGender} from '../interfaces/IGender';
import {ILanguage} from '../interfaces/ILanguage';
import {IUser} from '../interfaces/IUser';
import {Metadata} from './Metadata';
import {ITimeInterval} from "../interfaces/ITimeInterval";

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
  threshold?: number;
  timesInExercise?: number;
  lastIssued?: ITimeInterval;

  constructor(wordDto?: IWordDto) {
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
    this.userCreated = {id: wordDto.user_created_id};
    this.threshold = wordDto.threshold;
    this.timesInExercise = wordDto.times_in_exercise;
    this.lastIssued = {
      years: wordDto.last_issued?.years || 0,
      mons: wordDto.last_issued?.mons || 0,
      days: wordDto.last_issued?.days || 0,
      hours: wordDto.last_issued?.hours || 0,
      minutes: wordDto.last_issued?.minutes || 0,
      seconds: wordDto.last_issued?.seconds || 0,
      milliseconds: wordDto.last_issued?.milliseconds || 0
    };
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
