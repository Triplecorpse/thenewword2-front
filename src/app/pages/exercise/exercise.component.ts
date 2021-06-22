import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {debounceTime, switchMap} from 'rxjs/operators';
import {merge, of, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {IWordCheck} from '../../interfaces/IWordCheck';
import {ILanguage} from '../../interfaces/ILanguage';
import {IWordSet} from '../../interfaces/IWordSet';
import {User} from '../../models/User';

export interface IFilterFormValue {
  wordset: number;
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
    wordset: new FormControl(''),
    language: new FormControl(''),
    threshold: new FormControl(20),
    limit: new FormControl(10),
    askForms: new FormControl(true),
    askGender: new FormControl(true),
    strictMode: new FormControl(false)
  });
  learningLanguages: ILanguage[];
  wordsets: IWordSet[];

  constructor(private wordService: WordService) {
  }

  ngOnInit(): void {
    this.wordService.getWordSets$()
      .subscribe(wordsets => {
        this.wordsets = wordsets;
      });

    this.learningLanguages = User.learningLanguages;
    this.filterFormGroup.controls.language.patchValue(this.learningLanguages[0]?.id);

    merge(of(this.filterFormGroup.value), this.filterFormGroup.valueChanges.pipe(debounceTime(1000)))
      .pipe(
        switchMap((filter: IFilterFormValue) => {
          return this.wordService.getWordsToLearn(filter);
        })
      )
      .subscribe((words: IWord[]) => {
        console.log(words);
        // this.wordsToLearn = words;
        // this.wordToAsk$.next(words[0]);
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
