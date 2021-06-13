import {IWordDto} from './IWordDto';

export interface IWordSetDto {
  id: number;
  name: string;
  words: IWordDto[];
}
