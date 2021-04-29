import { Component, OnInit } from '@angular/core';
import {WordService} from "../../../services/word.service";
import {Observable} from "rxjs";
import {IWord} from "../../../interfaces/IWord";
import {MatDialog} from "@angular/material/dialog";
import {ModalNewWordComponent} from "../../../components/modal-new-word/modal-new-word.component";

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  words$: Observable<IWord[]>;

  constructor(private wordService: WordService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.words$ = this.wordService.getWords();
  }

  openNewWordModal() {
    this.dialog.open(ModalNewWordComponent);
  }
}
