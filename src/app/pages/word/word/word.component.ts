import {Component, OnInit} from '@angular/core';
import {WordService} from '../../../services/word.service';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ModalNewWordComponent} from '../../../components/modal-new-word/modal-new-word.component';
import {IWordMetadata} from '../../../interfaces/IWordMetadata';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  metadata$: Observable<IWordMetadata>;
  wordListReload$ = new Subject<void>();

  constructor(private dialog: MatDialog, private wordService: WordService) {
  }

  ngOnInit(): void {
    this.metadata$ = this.wordService.getWordMetadata$();
  }

  openNewWordModal() {
    this.dialog.open(ModalNewWordComponent)
      .afterClosed()
      .subscribe((r) => {
        console.log("ddssad", r);
        this.wordListReload$.next();
      });
  }
}
