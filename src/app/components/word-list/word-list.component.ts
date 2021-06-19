import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {IWord} from '../../interfaces/IWord';
import {WordService} from '../../services/word.service';
import {MatDialog} from '@angular/material/dialog';
import {ModalNewWordComponent} from '../modal-new-word/modal-new-word.component';
import {IModalConfirm, ModalConfirmComponent} from '../modal-confirm/modal-confirm.component';
import {filter, switchMap, switchMapTo, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit {
  @Input() reload$: Observable<void>;
  @Input() words: IWord[];
  // words$: Observable<IWord[]>;
  displayedColumns: string[] = ['word', 'translations', 'from_language', 'gender', 'speech_part', 'actions'];

  constructor(private wordService: WordService,
              private dialog: MatDialog,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    // this.words$ = this.wordService.getWords$();
    // this.reload$?.subscribe(() => {
    //   this.words$ = this.wordService.getWords$();
    // });
  }

  openEditWordModal(element: IWord) {
    this.dialog.open(ModalNewWordComponent, {
      data: {word: element}
    })
      .afterClosed()
      .subscribe(() => {
        // this.words$ = this.wordService.getWords$();
      });
  }

  openDeleteWordModal(element: IWord) {
    combineLatest([
      this.translateService.get('MODALS.REMOVE_WORD.HEADER'),
      this.translateService.get('MODALS.REMOVE_WORD.BODY', {word: element.word})
    ])
      .pipe(
        switchMap(translationResult => {
          return this.dialog.open<any, IModalConfirm>(ModalConfirmComponent, {
            data: {
              header: translationResult[0],
              body: translationResult[1]
            }
          })
            .afterClosed();
        }),
        take(1),
        filter(result => !!result),
        switchMap(() => this.wordService.remove(element.dbid))
      )
      .subscribe(() => {
        // this.words$ = this.wordService.getWords$();
      });
  }
}
