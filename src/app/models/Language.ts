import {ILanguageDto} from '../interfaces/dto/IWordMetadataDto';
import {ILanguage} from '../interfaces/ILanguage';

export class Language implements ILanguage {
  id = 0;
  englishName = '';

  constructor(languageDto?: ILanguageDto) {
    this.id = languageDto.id;
    this.englishName = languageDto.english_name;
    this.nativeName = languageDto.native_name;
    this.rtl = languageDto.rtl;
    this.iso2 = languageDto.iso2;
  }

  iso2: string;
  nativeName: string;
  rtl: boolean;
}
