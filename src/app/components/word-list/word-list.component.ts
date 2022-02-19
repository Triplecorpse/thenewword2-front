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
import {combineLatest, Observable, of} from 'rxjs';
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
import {PluralizeService} from "../../services/pluralize.service";
import {ITimeInterval} from "../../interfaces/ITimeInterval";

type TEntity = 'years' | 'mons' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

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
              private translateService: TranslateService,
              private pluralizeService: PluralizeService) {
  }

  ngOnInit(): void {
    if (!this.readonly) {
      this.addDisplayedColumn('actions');
    }

    if (this.hideThresholdColumn) {
      this.removeDisplayedColumn('threshold');
      this.removeDisplayedColumn('last_issued');
    } else {
      this.addDisplayedColumn('threshold');
      this.addDisplayedColumn('last_issued');
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
        const pos = sort.direction === 'asc' ? -1 : 1;
        const __compareLastIssuedBy = (entity: TEntity, a: ITimeInterval, b: ITimeInterval): number => {
          return a[entity].toString().localeCompare(b[entity].toString(), undefined, {numeric: true});
        }

        switch (sort.active) {
          case 'word':
            this.words.sort((a, b) => a.word.localeCompare(b.word, a.originalLanguage.iso2, {sensitivity: 'base'}) * pos);
            break;
          case 'threshold':
            this.words.sort((a, b) => a.threshold > b.threshold ? pos : -pos);
            break;
          case 'gender':
            this.translateService.get('GENDERS')
              .subscribe((genderMap) => {
                this.words.sort((a, b) => {
                  const gender1 = a.gender?.englishName.toUpperCase();
                  const gender2 = b.gender?.englishName.toUpperCase();
                  const gender1Native = genderMap[gender1]?.toLowerCase();
                  const gender2Native = genderMap[gender2]?.toLowerCase();

                  if (gender1Native && !gender2Native) {
                    return -pos;
                  }

                  if (!gender1Native && gender2Native) {
                    return pos;
                  }

                  if (!gender1Native && !gender2Native) {
                    return 0;
                  }

                  return gender1Native.localeCompare(gender2Native, 'uk', {sensitivity: 'base'}) * pos;
                });
              });
            break;
          case 'speech_part':
            this.translateService.get('SPEECH_PARTS')
              .subscribe((speechPartMap) => {
                this.words.sort((a, b) => {
                  const speechPart1 = a.speechPart?.englishName.toUpperCase();
                  const speechPart2 = b.speechPart?.englishName.toUpperCase();
                  const speechPart1Native = speechPartMap[speechPart1]?.toLowerCase();
                  const speechPart2Native = speechPartMap[speechPart2]?.toLowerCase();

                  if (speechPart1Native && !speechPart2Native) {
                    return -pos;
                  }

                  if (!speechPart1Native && speechPart2Native) {
                    return pos;
                  }

                  if (!speechPart1Native && !speechPart2Native) {
                    return 0;
                  }

                  return speechPart1Native.localeCompare(speechPart2Native, 'uk', {sensitivity: 'base'}) * pos;
                });
              });
            break;
          case 'last_issued':
            this.words.sort((a, b) => {
              const entities: TEntity[] = ['years', 'mons', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
              let entity = entities.shift();
              let result = 0;

              while (result === 0 && entities.length > 0) {
                result = __compareLastIssuedBy(entity, a.lastIssued, b.lastIssued)
                entity = entities.shift();
              }

              return result * pos;
            });
            break;
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

  getLastIssueValue(time: ITimeInterval): Observable<string> {
    let part = 'SECONDS';
    let value = time.seconds;

    if (time.years) {
      part = 'YEARS';
      value = time.years;
    } else if (time.mons) {
      part = 'MONS';
      value = time.mons;
    } else if (time.days) {
      part = 'DAYS';
      value = time.days;
    } else if (time.hours) {
      part = 'HOURS';
      value = time.hours;
    } else if (time.minutes) {
      part = 'MINUTES';
      value = time.minutes;
    }

    return this.pluralizeService.pluralize(`WORDS.LAST_ISSUED.${part}`, value);
  }

  private removeDisplayedColumn(name: string) {
    const indexOf = this.displayedColumns.indexOf(name);

    if (indexOf > -1) {
      this.displayedColumns.splice(indexOf, 1);
    }
  }

  private addDisplayedColumn(name: string) {
    const order: string[] = ['word', 'translations', 'from_language', 'gender', 'speech_part', 'threshold', 'last_issued', 'actions'];
    const indexOf = order.indexOf(name);

    if (indexOf > -1 && this.displayedColumns.indexOf(name) === -1) {
      this.displayedColumns.splice(indexOf, 0, order[indexOf]);
      this.displayedColumns.filter(col => !!col);
    }
  }
}
