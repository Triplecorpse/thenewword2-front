import {IWord} from "./IWord";
import {Change} from "./dto/IWordCheckDto";
import {SafeHtml} from "@angular/platform-browser";

export interface IWordCheck {
  status: 'right' | 'wrong' | 'skipped';
  isRight: boolean;
  vault: IWord;
  you: IWord;
  diff?: Change[];
  errQuantity?: number;
  formattedString?: SafeHtml;
}
