import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import {UserService} from "../../services/user.service";
import {Word} from "../../models/Word";
import {WordSet} from "../../models/WordSet";

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() wordset: IWordSet;
  @Input() words: IWord[];
  @Input() readonly: boolean;
  @Input() hideWordColumn = false;
  @Input() hideThresholdColumn = true;
  @Output() triggerUpdate = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['translations', 'from_language', 'gender', 'speech_part'];

  constructor(private wordService: WordService,
              private userService: UserService,
              private dialog: MatDialog,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    if (!this.readonly) {
      this.addDisplayedColumn('actions');
    }

    if (this.hideThresholdColumn) {
      this.removeDisplayedColumn('threshold');
    } else {
      this.addDisplayedColumn('threshold');
    }

    if (this.hideWordColumn) {
      this.removeDisplayedColumn('word');
    } else {
      this.addDisplayedColumn('word');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hideWordColumn?.currentValue === true) {
      this.removeDisplayedColumn('word')
    } else if (changes.hideWordColumn?.currentValue === false) {
      this.addDisplayedColumn('word');
    }
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
        wordsetForeignLanguage: this.wordset.foreignLanguage,
        wordsetNativeLanguage: this.wordset.nativeLanguage
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
          wordsetForeignLanguage: this.wordset.foreignLanguage,
          wordsetNativeLanguage: this.wordset.nativeLanguage,
          wordsetId: this.wordset.id
        }
      }
    )
      .afterClosed()
      .subscribe((word: IWord) => {
        this.triggerUpdate.emit();
      });
  }

  getDataSource() {
    return of(this.words);
  }

  checkAuthority(element: IWord | IWordSet): boolean {
    const user = this.userService.getUser();

    if (element instanceof Word) {
      return user.id === element.userCreated?.id;
    } else if (element instanceof WordSet) {
      return user.id === element.userCreatedId;
    }

    return false;
  }

  private removeDisplayedColumn(name: string) {
    const indexOf = this.displayedColumns.indexOf(name);

    if (indexOf > -1) {
      this.displayedColumns.splice(indexOf, 1);
    }
  }

  private addDisplayedColumn(name: string) {
    const order: string[] = ['word', 'translations', 'from_language', 'gender', 'speech_part', 'threshold', 'actions'];
    const indexOf = order.indexOf(name);

    if (indexOf > -1 && this.displayedColumns.indexOf(name) === -1) {
      this.displayedColumns.splice(indexOf, 0, order[indexOf]);
      this.displayedColumns.filter(col => !!col);
    }
  }
}
