import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IWord} from '../../interfaces/IWord';
import {WordService} from '../../services/word.service';
import {MatDialog} from '@angular/material/dialog';
import {ModalNewWordComponent} from '../modal-new-word/modal-new-word.component';
import {IModalConfirm, ModalConfirmComponent} from '../modal-confirm/modal-confirm.component';
import {filter, switchMapTo, take} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit {
  words$: Observable<IWord[]>;
  displayedColumns: string[] = ['word', 'translations', 'from_language', 'gender', 'speech_part', 'actions'];

  constructor(private wordService: WordService, private dialog: MatDialog, private httpClient: HttpClient) {
  }

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

  openDeleteWordModal(element: IWord) {
    this.dialog.open<any, IModalConfirm>(ModalConfirmComponent, {
      data: {
        header: 'Delete word?',
        body: `Do you want to delete word "${element.word}"? This cannot be undone.`
      }
    })
      .afterClosed()
      .pipe(
        take(1),
        filter(result => !!result),
        switchMapTo(this.httpClient.delete('word/delete', {params: {id: element.dbid.toString()}}))
      )
      .subscribe();
  }
}
