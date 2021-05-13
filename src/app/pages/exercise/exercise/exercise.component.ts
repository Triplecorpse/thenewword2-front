import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WordService} from "../../../services/word.service";
import {IWord} from "../../../interfaces/IWord";
import {delay, take} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {Word} from "../../../models/Word";

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  private wordsToLearn: IWord[] = [];
  private lastAskedId = 0;
  askedWords: IWord[] = [];
  wordToAsk$ = new Subject<IWord>();
  formGroup = new FormGroup({
    word: new FormControl()
  });

  constructor(private wordService: WordService) {
  }

  ngOnInit(): void {
    this.wordService.getWordsToLearn()
      .pipe(take(1))
      .subscribe(words => {
        this.wordsToLearn = words;
        this.wordToAsk$.next(words[0]);
      });
  }

  submit(word: IWord) {
    if (this.formGroup.value) {
      word.word = this.formGroup.value.word;
      this.wordService.checkWord(word)
        .subscribe(r => {
          this.askedWords.push(this.wordsToLearn[this.lastAskedId]);
          this.lastAskedId++;

          if (this.wordsToLearn[this.lastAskedId]) {
            this.wordToAsk$.next(this.wordsToLearn[this.lastAskedId]);
            this.formGroup.setValue({
              word: ''
            });
          }

          console.log(r);
        })
    }
  }
}
