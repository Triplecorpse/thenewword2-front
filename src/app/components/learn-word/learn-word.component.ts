import {Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {IWord} from '../../interfaces/IWord';
import {IWordCheck} from '../../interfaces/IWordCheck';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ILanguage} from '../../interfaces/ILanguage';
import {WordService} from '../../services/word.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {isPlatformBrowser} from '@angular/common';
import {MatSelectionListChange} from '@angular/material/list';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Change} from "../../interfaces/dto/IWordCheckDto";

@Component({
  selector: 'app-learn-word',
  templateUrl: './learn-word.component.html',
  styleUrls: ['./learn-word.component.scss']
})
export class LearnWordComponent implements OnInit {
  @Input() isExam!: boolean;
  @Input() words: IWord[];

  rightWords: IWordCheck[] = [];
  wrongWords: IWordCheck[] = [];
  answeredWords: IWordCheck[] = [];
  exerciseFormGroup = new FormGroup({
    word: new FormControl('', Validators.required)
  });
  wordToAsk: IWord;
  language: ILanguage;
  symbolsDisabled: boolean;
  isBrowser: boolean;
  mistakeLastIndex: number;

  @ViewChild('wordControl', {read: ElementRef}) private wordControl: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private wordService: WordService,
              private domSanitizer: DomSanitizer,
              private translateService: TranslateService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.wordToAsk = this.words.shift();
    this.language = this.wordToAsk.originalLanguage;
  }

  formSubmit(skipCheck?: boolean) {
    if (!this.exerciseFormGroup.valid && !skipCheck) {
      return;
    }

    const prevWordCheck: IWordCheck = [
      ...this.wrongWords
    ]
      .find(word => word.vault.dbid === this.wordToAsk.dbid);

    this.wordService.checkWord({
      ...this.wordToAsk,
      word: this.exerciseFormGroup.controls.word.value
    }, {}, skipCheck, prevWordCheck?.statId, prevWordCheck?.status as 'skipped' | 'wrong')
      .subscribe(response => {
        let htmlString = '';
        let errors = 0;

        response.diff.forEach((part: Change, index: number) => {
          let htmlPart = part.value;

          if (part.added) {
            htmlPart = `<span style="background-color: lightgreen">${part.value}</span>`;
            errors += part.value.length;
          }

          if (part.removed) {
            htmlPart = `<span style="background-color: lightcoral">${part.value}</span>`;
            errors += part.value.length;
          }

          htmlString += htmlPart;
        });
        response.errQuantity = Math.abs(errors);
        response.formattedString = this.domSanitizer.bypassSecurityTrustHtml(htmlString);

        if (response.isRight) {
          this.rightWords.push(response);
        } else {
          this.wrongWords.push(response);
        }

        this.answeredWords.push(response);

        if (prevWordCheck?.status === 'wrong') {
          this.wrongWords = this.wrongWords.filter(sw => sw.vault.dbid !== prevWordCheck.vault.dbid);
        }
      });

    if (this.words.length) {
      this.wordToAsk = this.words.shift();
      this.exerciseFormGroup.controls.word.setValue('');
      this.wordControl.nativeElement.focus();
      if (this.isBrowser) {
        sessionStorage.setItem('exercise', JSON.stringify(this.words));
      }
    } else {
      this.exerciseFormGroup.setValue({
        word: ''
      });
      this.exerciseFormGroup.controls.word.disable();
      this.wordToAsk = null;
      if (this.isBrowser) {
        sessionStorage.removeItem('exercise');
      }
    }
  }

  listSelection($event: MatSelectionListChange) {
    const selected: IWordCheck = $event.option.value;

    if ((selected.status === 'skipped' || selected.errQuantity <= 2) && !this.words.length) {
      this.wordToAsk = selected.vault;
      this.exerciseFormGroup.setValue({
        word: ''
      });
      this.exerciseFormGroup.controls.word.enable();
    }
  }

  setSymbol(symbol: string) {
    const selectionStart = this.wordControl.nativeElement.selectionStart;
    const selectionEnd = this.wordControl.nativeElement.selectionEnd;
    const newString1 = this.exerciseFormGroup.controls.word.value.slice(0, selectionStart);
    const newString2 = this.exerciseFormGroup.controls.word.value.slice(selectionEnd);
    const newString = `${newString1}${symbol}${newString2}`;

    this.exerciseFormGroup.controls.word.patchValue(newString);
    this.wordControl.nativeElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
    this.wordControl.nativeElement.focus();
  }

  getErrorText(errorQuantity: number): Observable<string> {
    const lastDigit = errorQuantity % 10;
    const last2Digit = errorQuantity % 100;

    return this.translateService.get(`EXERCISE.MISTAKES.${last2Digit}`)
      .pipe(
        switchMap(label => {
          if (label === `EXERCISE.MISTAKES.${last2Digit}`) {
            return this.translateService.get(`EXERCISE.MISTAKES.${lastDigit}`);
          }

          return of(label);
        }),
        map(errorLabel => `(${errorQuantity} ${errorLabel})`)
      );
  }
}
