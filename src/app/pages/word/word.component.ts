import {Component, OnDestroy, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import {combineLatest, merge, Observable, of, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {IWordMetadata} from '../../interfaces/IWordMetadata';
import {MetadataService} from '../../services/metadata.service';
import {UserService} from '../../services/user.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {ModalNewWordsetComponent} from '../../components/modal-new-wordset/modal-new-wordset.component';
import {IWordSet} from '../../interfaces/IWordSet';
import {IModalConfirm, ModalConfirmComponent} from '../../components/modal-confirm/modal-confirm.component';
import {debounceTime, filter, map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {IWord} from '../../interfaces/IWord';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../models/User';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit, OnDestroy {
  metadata: IWordMetadata;
  learningLanguages: ILanguage[];
  wordsets: IWordSet[];
  loadedWords: { [key: number]: IWord[] } = {};
  showUserSearch = false;
  userId: number;
  isLoading = false;
  private destroy$ = new Subject<void>();

  filterFormGroup = new FormGroup({
    searchByUser: new FormControl(this.userService.getUser()?.login),
    searchByName: new FormControl(''),
    foreignLanguage: new FormControl(''),
    nativeLanguages: new FormControl(User.nativeLanguages.map(({id}) => id)),
    showPool: new FormControl(false)
  });

  constructor(private dialog: MatDialog,
              private wordService: WordService,
              private metadataService: MetadataService,
              private translateService: TranslateService,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.metadata = this.metadataService.metadata;
    this.learningLanguages = this.userService.getUser().learningLanguages;
    this.userId = User.id;
    this.registerFilterFormChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openNewWordSetModal() {
    this.dialog.open<any, null, IWordSet>(ModalNewWordsetComponent)
      .afterClosed()
      .pipe(filter(result => !!result))
      .subscribe((wordSet: IWordSet) => {
        this.wordsets.push(wordSet);
      });
  }

  openDeleteWordSetModal(event: MouseEvent, wordset: IWordSet) {
    event.stopPropagation();

    combineLatest([
      this.translateService.get('MODALS.REMOVE_WORDSET.HEADER'),
      this.translateService.get('MODALS.REMOVE_WORDSET.BODY', {wordSet: wordset.name})
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
        switchMap(() => this.wordService.removeWordset(wordset.id)),
        tap(() => {
          const index = this.wordsets.findIndex(ws => ws.id === wordset.id);
          this.wordsets.splice(index, 1);
        }),
        switchMap(() => this.translateService.get('WORDS.REMOVE_WORDSET_SUCCESS', {wordSet: wordset.name}))
      )
      .subscribe(translation => {
        this.snackBar.open(translation, '', {duration: 10000});
      });
  }

  wordsetOpened(wordset: IWordSet) {
    if (!this.loadedWords[wordset.id]) {
      this.updateWords(wordset);
    }
  }

  openEditWordSetModal(event: MouseEvent, wordSet: IWordSet) {
    event.stopPropagation();
    this.dialog.open<any, IWordSet, IWordSet>(ModalNewWordsetComponent, {
      data: {...wordSet}
    })
      .afterClosed()
      .pipe(filter(r => !!r))
      .subscribe((newWordSet: IWordSet) => {
        const index = this.wordsets.findIndex(ws => ws.id === newWordSet.id);
        this.wordsets[index] = newWordSet;
      });
  }

  exercise(event: MouseEvent, wordset: IWordSet) {
    this.router.navigate(['exercise'], {queryParams: {wordset: wordset.id}});
  }

  poolChange(event: MatSlideToggleChange) {
    this.showUserSearch = event.checked;

    if (this.showUserSearch) {
      this.filterFormGroup.controls.searchByUser.setValue('');
    } else {
      this.filterFormGroup.controls.searchByUser.setValue(this.userService.getUser()?.login);
    }
  }

  getWordsText(quantity: number): Observable<string> {
    if (quantity === 0) {
      return this.translateService.get(`WORDS.WORDS.NO`);
    }

    const lastDigit = quantity % 10;
    const last2Digit = quantity % 100;

    return this.translateService.get(`WORDS.WORDS.${last2Digit}`)
      .pipe(
        switchMap(label => {
          if (label === `WORDS.WORDS.${last2Digit}`) {
            return this.translateService.get(`WORDS.WORDS.${lastDigit}`);
          }

          return of(label);
        }),
        map(label => `${quantity} ${label}`)
      );
  }

  private registerFilterFormChange() {
    merge(this.filterFormGroup.valueChanges.pipe(debounceTime(1000)), of(this.filterFormGroup.value))
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => {
          return this.wordService.getWordSets$({
            name: this.filterFormGroup.controls.searchByName.value,
            user_created_login: this.filterFormGroup.controls.searchByUser.value,
            foreign_language_id: this.filterFormGroup.controls.foreignLanguage.value,
            native_language_id: this.filterFormGroup.controls.nativeLanguages.value,
          });
        }),
        map(wordsets => wordsets.filter(wordset => wordset.userIsSubscribed === !this.filterFormGroup.value.showPool)),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.isLoading = false;
        this.wordsets = value;
      });
  }

  subscribeToWordset(event: MouseEvent, wordset: IWordSet) {
    event.stopPropagation();
    this.wordService.addOrModifyWordSet(wordset, true)
      .pipe(
        tap(() => {
          const index = this.wordsets.findIndex(ws => ws.id === wordset.id);
          this.wordsets.splice(index, 1);
        }),
        switchMap((wordset) => this.translateService.get('WORDS.SUBSCRIBED_WORDSET_SUCCESS',
          {
            wordSet: wordset.name,
            foreign: wordset.foreignLanguage.nativeName,
            native: wordset.nativeLanguage.nativeName
          }))
      )
      .subscribe(translation => {
        this.snackBar.open(translation, '', {duration: 10000});
      });
  }

  updateWords(wordset: IWordSet) {
    wordset.isLoading = true;
    this.wordService.getWords$({word_set_id: wordset.id})
      .subscribe(words => {
        wordset.isLoading = false;
        this.loadedWords[wordset.id] = words;
      });
  }
}
