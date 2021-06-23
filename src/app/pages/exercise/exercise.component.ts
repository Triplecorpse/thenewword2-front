import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {debounceTime, filter, map, switchMap, tap} from 'rxjs/operators';
import {merge, of, Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IWordCheck} from '../../interfaces/IWordCheck';
import {ILanguage} from '../../interfaces/ILanguage';
import {IWordSet} from '../../interfaces/IWordSet';
import {User} from '../../models/User';
import {Metadata} from "../../models/Metadata";

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
export class ExerciseComponent implements OnInit {
  private lastAskedId = 0;
  rightWords: IWordCheck[];
  wrongWords: IWordCheck[];
  skippedWords: IWordCheck[];
  askedWords: IWordCheck[] = [];
  wordToAsk$ = new Subject<IWord>();
  wordToAsk: IWord;
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

  constructor(private wordService: WordService) {
  }

  ngOnInit(): void {
    this.wordService.getWordSets$()
      .subscribe(wordsets => {
        this.wordsets = wordsets;
        this.rebuildWordsets()
      });

    this.learningLanguages = User.learningLanguages;
    this.filterFormGroup.controls.language.patchValue(this.learningLanguages[0]?.id);

    this.filterFormGroup.controls.wordset.valueChanges
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

    const backendControlsChange = merge(
      this.filterFormGroup.controls.wordset.valueChanges,
      this.filterFormGroup.controls.language.valueChanges,
      this.filterFormGroup.controls.threshold.valueChanges,
      this.filterFormGroup.controls.limit.valueChanges
    ).pipe(
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
        this.words = words;
      });
  }

  exerciseFormSubmit(skipCheck?: boolean) {
    if (!this.exerciseFormGroup.valid && !skipCheck) {
      return;
    }

    const word: IWordCheck = {
      isRight: this.wordToAsk.word === this.exerciseFormGroup.controls.word.value,
      you: {...this.wordToAsk, word: this.exerciseFormGroup.controls.word.value},
      vault: this.wordToAsk,
      status: skipCheck
        ? 'skipped'
        : this.wordToAsk.word === this.exerciseFormGroup.controls.word.value
          ? 'right'
          : 'wrong'
    }

    if (skipCheck) {
      this.skippedWords.push(word);
    } else if (word.isRight) {
      this.rightWords.push(word)
    } else if (!word.isRight) {
      this.wrongWords.push(word)
    }

    this.wordService.checkWord({...this.wordToAsk, word: this.exerciseFormGroup.controls.word.value})
      .subscribe(response => {
        console.log(response);
      });



    if (this.words.length) {
      this.wordToAsk = this.words.shift();
      this.exerciseFormGroup.controls.word.setValue('');
    }
    // if (this.exerciseFormGroup.value) {
    //   word.word = this.exerciseFormGroup.value.word;
    //   this.wordService.checkWord(word)
    //     .subscribe(result => {
    //       this.askedWords.push(result);
    //       this.lastAskedId++;
    //
    //       if (this.wordsToLearn[this.lastAskedId]) {
    //         this.wordToAsk$.next(this.wordsToLearn[this.lastAskedId]);
    //         this.exerciseFormGroup.setValue({
    //           word: ''
    //         });
    //       } else {
    //         this.allAnswered = true;
    //       }
    //     });
    // }
  }

  filterFormSubmit() {
    this.isExercising = true;
    this.wordToAsk = this.words.shift();
  }

  getWordSetTooltip(): string {
    const raw = this.filterFormGroup.value.wordset;
    return this.wordsets?.filter(ws => raw.includes(ws.id)).map(ws => ws.name).join(', ');
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
}
