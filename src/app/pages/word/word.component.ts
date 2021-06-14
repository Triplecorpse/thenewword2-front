import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ModalNewWordComponent} from '../../components/modal-new-word/modal-new-word.component';
import {IWordMetadata} from '../../interfaces/IWordMetadata';
import {MetadataService} from '../../services/metadata.service';
import {UserService} from '../../services/user.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {ModalNewWordsetComponent} from '../../components/modal-new-wordset/modal-new-wordset.component';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  metadata: IWordMetadata;
  wordListReload$ = new Subject<void>();
  learningLanguages: ILanguage[];

  constructor(private dialog: MatDialog,
              private wordService: WordService,
              private metadataService: MetadataService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.metadata = this.metadataService.metadata;
    this.learningLanguages = this.userService.getUser().learningLanguages;
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
      .subscribe();
  }
}
