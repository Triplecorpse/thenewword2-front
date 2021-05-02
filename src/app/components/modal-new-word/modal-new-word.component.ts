import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {switchMap, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IWordMetadata} from '../../interfaces/IWordMetadata';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-new-word',
  templateUrl: './modal-new-word.component.html',
  styleUrls: ['./modal-new-word.component.scss']
})
export class ModalNewWordComponent implements OnInit {
  isEditing = false;
  wordMetadata$: Observable<IWordMetadata>;
  formGroup = new FormGroup({
    word: new FormControl(''),
    translations: new FormControl(''),
    fromLanguage: new FormControl(''),
    toLanguage: new FormControl(''),
    speechPart: new FormControl(''),
    gender: new FormControl(''),
    forms: new FormControl(''),
    remarks: new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<any>,
              private wordService: WordService,
              @Inject(MAT_DIALOG_DATA) public data: {word: IWord}) { }

  ngOnInit(): void {
    this.wordMetadata$ = this.wordService.getWordMetadata$();
    if (this.data?.word) {
      this.isEditing = true;
      this.formGroup.setValue({
        word: this.data.word.word,
        translations: this.data.word.translations,
        fromLanguage: this.data.word.originalLanguage.id,
        toLanguage: this.data.word.translatedLanguage.id,
        speechPart: this.data.word.speechPart.id,
        gender: this.data.word.gender.id,
        forms: this.data.word.forms,
        remarks: this.data.word.remarks
      });
    }
  }

  saveWord() {
    if (this.formGroup.value) {
      const form = this.formGroup.value;

      this.wordService.wordFromDto({
        id: this.data?.word.dbid,
        word: form.word,
        gender_id: form.gender,
        forms: form.forms,
        translations: form.translations,
        speech_part_id: form.speechPart,
        remarks: form.remarks,
        stress_letter_index: 0,
        original_language_id: form.fromLanguage,
        translated_language_id: form.toLanguage
      })
        .pipe(
          take(1),
          switchMap(word => this.wordService.addOrModifyWord(word))
        )
        .subscribe(result => {
          this.dialogRef.close(result);
        });
    }
  }
}
