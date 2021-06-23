import {IWord} from "./IWord";

export interface IWordCheck {
  status: 'right' | 'wrong' | 'skipped';
  isRight: boolean,
  vault: IWord,
  you: IWord
}
