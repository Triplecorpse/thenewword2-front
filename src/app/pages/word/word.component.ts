import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import {combineLatest} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ModalNewWordComponent} from '../../components/modal-new-word/modal-new-word.component';
import {IWordMetadata} from '../../interfaces/IWordMetadata';
import {MetadataService} from '../../services/metadata.service';
import {UserService} from '../../services/user.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {ModalNewWordsetComponent} from '../../components/modal-new-wordset/modal-new-wordset.component';
import {IWordSet} from '../../interfaces/IWordSet';
import {IModalConfirm, ModalConfirmComponent} from '../../components/modal-confirm/modal-confirm.component';
import {filter, switchMap, take} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {IWord} from '../../interfaces/IWord';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  metadata: IWordMetadata;
  learningLanguages: ILanguage[];
  wordsets: IWordSet[];
  loadedWords: {[key: number]: IWord[]} = {};

  constructor(private dialog: MatDialog,
              private wordService: WordService,
              private metadataService: MetadataService,
              private translateService: TranslateService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.metadata = this.metadataService.metadata;
    this.learningLanguages = this.userService.getUser().learningLanguages;
    this.wordService.getWordSets$()
      .subscribe(wordsets => {
        this.wordsets = wordsets;
      });
  }

  openNewWordModal(event: MouseEvent, wordset: IWordSet) {
    event?.stopPropagation();
    this.dialog.open<any, number, IWord>(ModalNewWordComponent, {data: wordset.id})
      .afterClosed()
      .subscribe(() => {
      });
  }

  openNewWordSetModal() {
    this.dialog.open<any, null, IWordSet>(ModalNewWordsetComponent)
      .afterClosed()
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
        switchMap(() => this.wordService.removeWordset(wordset.id))
      )
      .subscribe(() => {
        this.updateWordSets();
      });
  }

  wordsetOpened(wordset: IWordSet) {
    if (!this.loadedWords[wordset.id]) {
      this.wordService.getWords$({word_set_id: wordset.id})
        .subscribe(words => {
          this.loadedWords[wordset.id] = words;
        });
    }
  }

  private updateWordSets() {
    this.wordService.getWordSets$()
      .subscribe(wordsets => {
        this.wordsets = wordsets;
      });
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
}
