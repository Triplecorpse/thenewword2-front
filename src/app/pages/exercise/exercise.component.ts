import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {debounceTime, filter, map, switchMap, tap} from 'rxjs/operators';
import {merge, of, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {IWordCheck} from '../../interfaces/IWordCheck';
import {ILanguage} from '../../interfaces/ILanguage';
import {IWordSet} from '../../interfaces/IWordSet';
import {User} from '../../models/User';

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
  private wordsToLearn: IWord[] = [];
  private lastAskedId = 0;
  askedWords: IWordCheck[] = [];
  wordToAsk$ = new Subject<IWord>();
  formGroup = new FormGroup({
    word: new FormControl()
  });
  allAnswered: boolean;
  filterFormGroup = new FormGroup({
    wordset: new FormControl([]),
    language: new FormControl(''),
    threshold: new FormControl(20),
    limit: new FormControl(10),
    askForms: new FormControl(true),
    askGender: new FormControl(true),
    typoMode: new FormControl(false),
    askStress: new FormControl(false),
    allowLearn: new FormControl(false)
  });
  learningLanguages: ILanguage[];
  wordsets: IWordSet[];
  words: IWord[];

  constructor(private wordService: WordService) {
  }

  ngOnInit(): void {
    this.wordService.getWordSets$()
      .subscribe(wordsets => {
        this.wordsets = wordsets;
      });

    this.learningLanguages = User.learningLanguages;
    this.filterFormGroup.controls.language.patchValue(this.learningLanguages[0]?.id);

    const backendControlsChange = merge(
      this.filterFormGroup.controls.wordset.valueChanges,
      this.filterFormGroup.controls.language.valueChanges,
      this.filterFormGroup.controls.threshold.valueChanges,
      this.filterFormGroup.controls.limit.valueChanges
    ).pipe(
      debounceTime(1000),
      map(() => ({
        wordset: this.filterFormGroup.value.wordset,
        language: this.filterFormGroup.value.language,
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

    this.wordService.getWordsToLearn(this.filterFormGroup.value)
  }

  submit(word: IWord) {
    if (this.formGroup.value) {
      word.word = this.formGroup.value.word;
      this.wordService.checkWord(word)
        .subscribe(result => {
          this.askedWords.push(result);
          this.lastAskedId++;

          if (this.wordsToLearn[this.lastAskedId]) {
            this.wordToAsk$.next(this.wordsToLearn[this.lastAskedId]);
            this.formGroup.setValue({
              word: ''
            });
          } else {
            this.allAnswered = true;
          }
        });
    }
  }

  filterFormSubmit() {

  }

  getWordSetTooltip(): string {
    const raw = this.filterFormGroup.value.wordset;
    return this.wordsets?.filter(ws => raw.includes(ws.id)).map(ws => ws.name).join(', ');
  }
}
