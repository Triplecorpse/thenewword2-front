import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import {combineLatest, Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ModalNewWordComponent} from '../../components/modal-new-word/modal-new-word.component';
import {IWordMetadata} from '../../interfaces/IWordMetadata';
import {MetadataService} from '../../services/metadata.service';
import {UserService} from '../../services/user.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {ModalNewWordsetComponent} from '../../components/modal-new-wordset/modal-new-wordset.component';
import {IWordSet} from "../../interfaces/IWordSet";
import {IModalConfirm, ModalConfirmComponent} from "../../components/modal-confirm/modal-confirm.component";
import {filter, switchMap, take} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  metadata: IWordMetadata;
  wordListReload$ = new Subject<void>();
  learningLanguages: ILanguage[];
  wordsets: IWordSet[];

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
      })
  }

  openNewWordModal(event?: MouseEvent) {
    event?.stopPropagation();
    this.dialog.open(ModalNewWordComponent)
      .afterClosed()
      .subscribe(() => {
        this.wordListReload$.next();
      });
  }

  openNewWordSetModal() {
    this.dialog.open(ModalNewWordsetComponent)
      .afterClosed()
      .subscribe(() => {
        this.updateWordSets();
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
            .afterClosed()
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
    console.log(wordset);
  }

  private updateWordSets() {
    this.wordService.getWordSets$()
      .subscribe(wordsets => {
        this.wordsets = wordsets;
      });
  }

  openEditWordSetModal($event: MouseEvent, wordSet: IWordSet) {
    this.dialog.open(ModalNewWordsetComponent, {
      data: {wordSet}
    })
      .afterClosed()
      .subscribe(() => {
        this.wordListReload$.next();
      });
  }
}
