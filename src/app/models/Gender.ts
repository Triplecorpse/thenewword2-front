import {IGender} from '../interfaces/IGender';
import {IGenderDto} from '../interfaces/dto/IWordMetadataDto';

export class Gender implements IGender {
  id = 0;
  englishName = '';

  constructor(genderDto?: IGenderDto) {
    this.id = genderDto.id;
    this.englishName = genderDto.name;
  }
}
