import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {WordService} from "../../services/word.service";
import {IWord} from "../../interfaces/IWord";
import {switchMap, take, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {IWordMetadata} from "../../interfaces/IWordMetadata";
import {Word} from "../../models/Word";
import {UserService} from "../../services/user.service";
import {IUser} from "../../interfaces/IUser";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-modal-new-word',
  templateUrl: './modal-new-word.component.html',
  styleUrls: ['./modal-new-word.component.scss']
})
export class ModalNewWordComponent implements OnInit {
  word: IWord;
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
              private userService: UserService) { }

  ngOnInit(): void {
    this.wordMetadata$ = this.wordService.getWordMetadata$();
  }

  saveWord() {
    if (this.formGroup.value) {
      const form = this.formGroup.value;

      this.wordService.wordFromDto({
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
          switchMap(word => this.wordService.addWord(word))
        )
        .subscribe(result => {
          this.dialogRef.close(result);
        });
    }
  }
}
