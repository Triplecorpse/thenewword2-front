import { Component, OnInit } from '@angular/core';
import {WordService} from "../../../services/word.service";
import {Observable} from "rxjs";
import {IWord} from "../../../interfaces/IWord";
import {MatDialog} from "@angular/material/dialog";
import {ModalNewWordComponent} from "../../../components/modal-new-word/modal-new-word.component";
import {IWordMetadata} from "../../../interfaces/IWordMetadata";

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  metadata$: Observable<IWordMetadata>;
  constructor(private dialog: MatDialog, private wordService: WordService) { }

  ngOnInit(): void {
    this.metadata$ = this.wordService.getWordMetadata$();
  }

  openNewWordModal() {
    this.dialog.open(ModalNewWordComponent);
  }
}
