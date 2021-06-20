import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {combineLatest, of} from 'rxjs';
import {IWord} from '../../interfaces/IWord';
import {WordService} from '../../services/word.service';
import {MatDialog} from '@angular/material/dialog';
import {IWordModalInputData, ModalNewWordComponent} from '../modal-new-word/modal-new-word.component';
import {IModalConfirm, ModalConfirmComponent} from '../modal-confirm/modal-confirm.component';
import {filter, switchMap, take} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {IWordSet} from '../../interfaces/IWordSet';
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, AfterViewInit {
  @Input() wordset: IWordSet;
  @Input() words: IWord[];
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['word', 'translations', 'from_language', 'gender', 'speech_part', 'actions'];

  constructor(private wordService: WordService,
              private dialog: MatDialog,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.sort.sortChange
      .subscribe(sort => {
        if (sort.active === 'word') {
          let pos = 1;

          if (sort.direction === 'asc') {
            pos = -pos;
          }

          this.words.sort((a, b) => a.word.toLowerCase() > b.word.toLowerCase() ? pos : -pos);
        }
      });
  }

  openEditWordModal(element: IWord) {
    this.dialog.open<any, IWordModalInputData, IWord>(ModalNewWordComponent, {
      data: {
        word: element,
        wordsetId: this.wordset.id,
        wordsetLanguage: this.wordset.translatedlanguage
      }
    })
      .afterClosed()
      .pipe(
        filter(r => !!r)
      )
      .subscribe((word: IWord) => {
        const index = this.words.findIndex(w => w.dbid === word.dbid);
        this.words[index] = word;
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

  openNewWordModal(event: MouseEvent) {
    event?.stopPropagation();
    this.dialog.open<any, IWordModalInputData, IWord>(ModalNewWordComponent,
      {
        data: {
          wordsetLanguage: this.wordset.translatedlanguage,
          wordsetId: this.wordset.id
        }
      }
    )
      .afterClosed()
      .pipe(
        filter(r => !!r)
      )
      .subscribe((word: IWord) => {
        this.words.push(word);
      });
  }

  getDataSource() {
    return of(this.words);
  }
}
