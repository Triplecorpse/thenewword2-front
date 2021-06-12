import {IGenderDto, ISpeechPartDto} from '../interfaces/dto/IWordMetadataDto';
import {ISpeechPart} from '../interfaces/ISpeechPart';

export class SpeechPart implements ISpeechPart {
  id = 0;
  englishName = '';

  constructor(genderDto?: ISpeechPartDto) {
    this.id = genderDto.id;
    this.englishName = genderDto.name;
  }
}
