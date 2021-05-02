import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {IWord} from '../../interfaces/IWord';
import {WordService} from '../../services/word.service';
import {MatDialog} from "@angular/material/dialog";
import {ModalNewWordComponent} from "../modal-new-word/modal-new-word.component";

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit {
  words$: Observable<IWord[]>;
  displayedColumns: string[] = ['word', 'translations', 'from_language', 'to_language', 'gender', 'speech_part', 'actions'];

  constructor(private wordService: WordService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.words$ = this.wordService.getWords$();

    this.words$.subscribe(w => {
      console.log(w);
    });
  }

  openEditWordModal(element: IWord) {
    this.dialog.open(ModalNewWordComponent, {
      data: {word: element}
    });
  }
}
