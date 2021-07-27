import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {debounceTime, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {merge, Observable, of, Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IWordCheck} from '../../interfaces/IWordCheck';
import {ILanguage} from '../../interfaces/ILanguage';
import {IWordSet} from '../../interfaces/IWordSet';
import {User} from '../../models/User';
import {Metadata} from "../../models/Metadata";
import {DomSanitizer} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";
import {ActivatedRoute, Route} from "@angular/router";

export interface IFilterFormValue {
  wordset: number[];
  language: number;
  threshold: number;
  limit: number;
  askForms: boolean;
  askGender: boolean;
  strictMode: boolean;
}

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit, OnDestroy {
  rightWords: IWordCheck[] = [];
  wrongWords: IWordCheck[] = [];
  skippedWords: IWordCheck[] = [];
  askedWords: IWordCheck[] = [];
  wordToAsk: IWord;
  exerciseFinished: boolean;
  exerciseFormGroup = new FormGroup({
    word: new FormControl('', Validators.required)
  });
  allAnswered: boolean;
  filterFormGroup = new FormGroup({
    wordset: new FormControl([]),
    language: new FormControl(''),
    threshold: new FormControl(20),
    limit: new FormControl(10),
    askForms: new FormControl({value: false, disabled: true}),
    askGender: new FormControl({value: false, disabled: true}),
    typoMode: new FormControl(false),
    askStress: new FormControl({value: false, disabled: true}),
    allowLearn: new FormControl(false)
  });
  learningLanguages: ILanguage[];
  wordsets: IWordSet[];
  displayedWordsets: { wordsets: IWordSet[]; language: ILanguage }[];
  words: IWord[];
  isExercising: boolean;
  startButtonDisabled = true;
  symbolsDisabled: boolean;
  language: ILanguage;
  private destroy$ = new Subject<void>();

  @ViewChild('wordControl', {read: ElementRef}) private wordControl: ElementRef;

  constructor(private wordService: WordService,
              private translateService: TranslateService,
              private domSanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    //TODO: check if any on-going exercise
    this.wordService.getWordSets$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(wordsets => {
        this.wordsets = wordsets;
        this.rebuildWordsets();
        this.continueOnInitAfterGetWordsets();
      });

    this.learningLanguages = User.learningLanguages;
    this.filterFormGroup.controls.language.patchValue(this.learningLanguages[0]?.id);

    const backendControlsChange = merge(
      this.filterFormGroup.controls.wordset.valueChanges,
      this.filterFormGroup.controls.language.valueChanges,
      this.filterFormGroup.controls.threshold.valueChanges,
      this.filterFormGroup.controls.limit.valueChanges
    ).pipe(
      tap(() => {
        this.startButtonDisabled = true;
      }),
      debounceTime(1000),
      map(() => ({
        wordset: this.filterFormGroup.value.wordset,
        language: this.filterFormGroup.value.language || this.displayedWordsets[0].language.id,
        threshold: this.filterFormGroup.value.threshold,
        limit: this.filterFormGroup.value.limit
      }))
    );

    merge(of(this.filterFormGroup.value), backendControlsChange)
      .pipe(
        switchMap((filter: IFilterFormValue) => this.wordService.getWordsToLearn(filter))
      )
      .subscribe((words: IWord[]) => {
        if (words.length) {
          this.startButtonDisabled = false;
        }

        this.words = words;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exerciseFormSubmit(skipCheck?: boolean) {
    if (!this.exerciseFormGroup.valid && !skipCheck) {
      return;
    }

    const prevWordCheck: IWordCheck = [
      ...this.wrongWords,
      ...this.skippedWords
    ]
      .find(word => word.vault.dbid === this.wordToAsk.dbid);

    this.wordService.checkWord({
      ...this.wordToAsk,
      word: this.exerciseFormGroup.controls.word.value
    }, {}, skipCheck, prevWordCheck?.statId, prevWordCheck?.status as 'skipped' | 'wrong')
      .subscribe(response => {
        let htmlString = '';
        let errors = 0;

        response.diff.forEach((part) => {
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

        if (skipCheck) {
          this.skippedWords.push(response);
        } else if (response.isRight) {
          this.rightWords.push(response)
        } else if (!response.isRight) {
          this.wrongWords.push(response)
        }

        if (prevWordCheck?.status === 'skipped') {
          this.skippedWords = this.skippedWords.filter(sw => sw.vault.dbid !== prevWordCheck.vault.dbid);
        }

        if (prevWordCheck?.status === 'wrong') {
          this.wrongWords = this.wrongWords.filter(sw => sw.vault.dbid !== prevWordCheck.vault.dbid);
        }
      });

    if (this.words.length) {
      this.wordToAsk = this.words.shift();
      this.exerciseFormGroup.controls.word.setValue('');
    } else {
      this.exerciseFormGroup.setValue({
        word: ''
      });
      this.exerciseFormGroup.controls.word.disable();
      this.wordToAsk = null;
    }
  }

  filterFormSubmit() {
    this.wordService.setExercise(this.words)
      .subscribe(() => {
        this.isExercising = true;
        this.wordToAsk = this.words.shift();
        this.language = this.wordToAsk.originalLanguage;
      })
  }

  getWordSetTooltip(): string {
    const raw = this.filterFormGroup.value.wordset;
    return this.wordsets?.filter(ws => raw.includes(ws.id)).map(ws => ws.name).join(', ');
  }

  getErrorText(errorQuantity: number): Observable<string> {
    const lastDigit = errorQuantity % 10;

    return this.translateService.get(`EXERCISE.MISTAKES.${lastDigit}`)
      .pipe(map(errorLabel => `(${errorQuantity} ${errorLabel})`));
  }

  private rebuildWordsets(languageId?: number) {
    const uniqLangCodes: number[] = [];

    if (languageId) {
      uniqLangCodes.push(languageId)
    } else {
      this.wordsets.forEach(ws => {
        if (!uniqLangCodes.includes(ws.translatedlanguage.id)) {
          uniqLangCodes.push(ws.translatedlanguage.id);
        }
      });
    }

    const uniqLangs: ILanguage[] = uniqLangCodes.map(code => Metadata.languages.find(l => l.id === code));

    this.displayedWordsets = uniqLangs.map((lang: ILanguage) => {
      const wordsets: IWordSet[] = this.wordsets.filter(ws => ws.translatedlanguage.id === lang.id)

      return {
        language: lang,
        wordsets
      }
    })
  }

  private continueOnInitAfterGetWordsets() {
    this.filterFormGroup.controls.wordset.valueChanges
      .pipe(
        filter(() => !!this.wordsets?.length),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        const wordset = this.wordsets.find(ws => ws.id === value[0]);

        if (value.length === 0) {
          this.rebuildWordsets()
          this.filterFormGroup.controls.language.enable();
          this.filterFormGroup.controls.limit.patchValue(10);
        }

        if (value.length === 1) {
          this.rebuildWordsets(wordset.translatedlanguage.id);
        }

        if (value.length) {
          const selectedWordSets = this.wordsets.filter(ws => value.includes(ws.id));
          const wordCount = selectedWordSets
            .reduce((prev: number, curr: IWordSet) => prev + curr.wordsCount, 0);
          this.filterFormGroup.controls.limit.patchValue(wordCount);
          this.filterFormGroup.controls.language.patchValue(wordset.translatedlanguage.id);
          this.filterFormGroup.controls.language.disable();
        }
      });

    this.activatedRoute.queryParams
      .pipe(
        filter(query => query.wordset),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        const wordsets = typeof query.wordset === "string"
          ? [+query.wordset]
          : [query.wordset.map((ws: string) => +ws)]

        this.filterFormGroup.patchValue({
          wordset: wordsets
        });
      });
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

  isAnythingToRecall(): boolean {
    return !!this.skippedWords.length || !!this.wrongWords.filter(ww => ww.errQuantity <= 2).length;
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
}
