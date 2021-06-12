import {Component, OnInit} from '@angular/core';
import {WordService} from '../../../services/word.service';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ModalNewWordComponent} from '../../../components/modal-new-word/modal-new-word.component';
import {IWordMetadata} from '../../../interfaces/IWordMetadata';
import {MetadataService} from '../../../services/metadata.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  metadata: IWordMetadata;
  wordListReload$ = new Subject<void>();

  constructor(private dialog: MatDialog, private wordService: WordService, private metadataService: MetadataService) {
  }

  ngOnInit(): void {
    this.metadata = this.metadataService.metadata;
  }

  openNewWordModal() {
    this.dialog.open(ModalNewWordComponent)
      .afterClosed()
      .subscribe(() => {
        this.wordListReload$.next();
      });
  }
}
