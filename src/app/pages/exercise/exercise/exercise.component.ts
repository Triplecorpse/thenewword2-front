import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WordService} from "../../../services/word.service";
import {IWord} from "../../../interfaces/IWord";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  private wordsToLearn: IWord[] = [];
  private lastAskedId = 0;
  isLoaded: boolean;

  constructor(private wordService: WordService) {
  }

  ngOnInit(): void {
    this.wordService.getWordsToLearn()
      .pipe(take(1))
      .subscribe((words => {
        this.isLoaded = true;
        this.wordsToLearn = words;
      }));
  }

  getWord(): IWord {
    if (this.wordsToLearn[this.lastAskedId]) {
      return this.wordsToLearn[this.lastAskedId];
    }

    return null;
  }
}
