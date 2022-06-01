import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {debounceTime, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {merge, of, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ILanguage} from '../../interfaces/ILanguage';
import {IWordSet} from '../../interfaces/IWordSet';
import {User} from '../../models/User';
import {Metadata} from '../../models/Metadata';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';

export interface IFilterFormValue {
  wordset: number[];
  language: number;
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
  filterFormGroup = new FormGroup({
    wordset: new FormControl([]),
    language: new FormControl(''),
    limit: new FormControl(10),
    askForms: new FormControl({value: false, disabled: true}),
    askGender: new FormControl({value: false, disabled: true}),
    typoMode: new FormControl({value: true, disabled: true}),
    askStress: new FormControl({value: false, disabled: true}),
    allowLearn: new FormControl(false)
  });
  learningLanguages: ILanguage[];
  wordsets: IWordSet[];
  displayedWordsets: { wordsets: IWordSet[]; language: ILanguage }[];
  words: IWord[];
  isExercising: boolean;
  startButtonDisabled = true;
  language: ILanguage;
  isLoading: boolean;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private wordService: WordService,
              private translateService: TranslateService,
              private domSanitizer: DomSanitizer,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // TODO: check if any on-going exercise
    this.wordService.getWordSets$()
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(wordsets => {
        this.isLoading = false;
        this.wordsets = wordsets;
        this.rebuildWordsets();
        this.continueOnInitAfterGetWordsets();
      });

    this.learningLanguages = User.learningLanguages;
    this.filterFormGroup.controls.language.patchValue(this.learningLanguages[0]?.id);

    const backendControlsChange = merge(
      this.filterFormGroup.controls.wordset.valueChanges,
      this.filterFormGroup.controls.language.valueChanges,
      this.filterFormGroup.controls.limit.valueChanges
    ).pipe(
      tap(() => {
        this.startButtonDisabled = true;
      }),
      debounceTime(1000),
      map(() => ({
        wordset: this.filterFormGroup.value.wordset,
        language: this.filterFormGroup.value.language || this.displayedWordsets[0].language.id,
        limit: this.filterFormGroup.value.limit
      }))
    );

    merge(of(this.filterFormGroup.value), backendControlsChange)
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((filterValue: IFilterFormValue) => this.wordService.getWordsToLearn(filterValue))
      )
      .subscribe((words: IWord[]) => {
        this.isLoading = false;
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

  toExercise(path: 'exam' | 'learn') {
    this.wordService.setExercise(this.words)
      .subscribe(() => {
        sessionStorage.setItem('exercise', JSON.stringify(this.words));
        sessionStorage.setItem('mode', path);
        this.router.navigate([path]);
      });
  }

  getWordSetTooltip(): string {
    const raw = this.filterFormGroup.value.wordset;
    return this.wordsets?.filter(ws => raw.includes(ws.id)).map(ws => ws.name).join(', ');
  }

  private rebuildWordsets(languageId?: number) {
    const uniqLangCodes: number[] = [];

    if (languageId) {
      uniqLangCodes.push(languageId);
    } else {
      this.wordsets.forEach(ws => {
        if (!uniqLangCodes.includes(ws.foreignLanguage.id)) {
          uniqLangCodes.push(ws.foreignLanguage.id);
        }
      });
    }

    const uniqLangs: ILanguage[] = uniqLangCodes.map(code => Metadata.languages.find(l => l.id === code));

    this.displayedWordsets = uniqLangs.map((lang: ILanguage) => {
      const wordsets: IWordSet[] = this.wordsets.filter(ws => ws.foreignLanguage.id === lang.id);

      return {
        language: lang,
        wordsets
      };
    });
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
          this.rebuildWordsets();
          this.filterFormGroup.controls.language.enable();
          this.filterFormGroup.controls.limit.patchValue(10);
        }

        if (value.length === 1) {
          this.rebuildWordsets(wordset.foreignLanguage.id);
        }

        if (value.length) {
          const selectedWordSets = this.wordsets.filter(ws => value.includes(ws.id));
          const wordCount = selectedWordSets
            .reduce((prev: number, curr: IWordSet) => prev + curr.wordsCount, 0);
          this.filterFormGroup.controls.limit.patchValue(wordCount);
          this.filterFormGroup.controls.language.patchValue(wordset.foreignLanguage.id);
          this.filterFormGroup.controls.language.disable();
        }
      });

    this.activatedRoute.queryParams
      .pipe(
        filter(query => query.wordset),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        const wordsets = typeof query.wordset === 'string'
          ? [+query.wordset]
          : [query.wordset.map((ws: string) => +ws)];

        this.filterFormGroup.patchValue({
          wordset: wordsets
        });
      });
  }
}
