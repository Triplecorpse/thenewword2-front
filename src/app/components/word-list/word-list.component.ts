import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {IWord} from '../../interfaces/IWord';
import {WordService} from '../../services/word.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit {
  words$: Observable<IWord[]>;
  displayedColumns: string[] = ['word', 'translations'];

  constructor(private wordService: WordService) { }

  ngOnInit(): void {
    this.words$ = this.wordService.getWords();
  }

}
