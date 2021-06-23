import {IWordDto} from "./IWordDto";

export interface Change {
  count?: number;
  value: string;
  added?: boolean;
  removed?: boolean;
}

export interface IWordCheckDto {
  status: 'right' | 'wrong' | 'skipped';
  right: boolean,
  you: IWordDto,
  vault: IWordDto,
  diff?: Change[]
}
