import {IWord} from "./IWord";
import {Change} from "./dto/IWordCheckDto";

export interface IWordCheck {
  status: 'right' | 'wrong' | 'skipped';
  isRight: boolean,
  vault: IWord,
  you: IWord,
  diff?: Change[]
}
