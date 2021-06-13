import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {IWordMetadata} from '../../interfaces/IWordMetadata';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {MetadataService} from '../../services/metadata.service';
import {ILanguage} from '../../interfaces/ILanguage';

@Component({
  selector: 'app-modal-new-word',
  templateUrl: './modal-new-word.component.html',
  styleUrls: ['./modal-new-word.component.scss']
})
export class ModalNewWordComponent implements OnInit {
  isEditing = false;
  wordMetadata: IWordMetadata;
  nativeLanguage: ILanguage;
  learningLanguages: ILanguage[];
  formGroup = new FormGroup({
    word: new FormControl('', Validators.required),
    translations: new FormControl('', Validators.required),
    fromLanguage: new FormControl('', Validators.required),
    toLanguage: new FormControl(''),
    transcription: new FormControl(''),
    speechPart: new FormControl('', Validators.required),
    gender: new FormControl(''),
    forms: new FormControl(''),
    remarks: new FormControl(''),
    stressLetterIndex: new FormControl()
  });

  constructor(private dialogRef: MatDialogRef<any>,
              private wordService: WordService,
              private userService: UserService,
              private metadataService: MetadataService,
              @Inject(MAT_DIALOG_DATA) public data: {word: IWord}) { }

  ngOnInit(): void {
    this.wordMetadata = {
      languages: this.metadataService.languages,
      genders: this.metadataService.genders,
      speechParts: this.metadataService.speechParts
    };
    this.nativeLanguage = this.userService.getUser().nativeLanguage;
    this.learningLanguages = this.userService.getUser().learningLanguages;
    this.formGroup.patchValue({
      fromLanguage: this.nativeLanguage.id
    });
    if (this.data?.word) {
      this.isEditing = true;
      this.formGroup.setValue({
        word: this.data.word.word,
        translations: this.data.word.translations.join(', '),
        fromLanguage: this.data.word.originalLanguage.id,
        toLanguage: this.data.word.translatedLanguage.id,
        speechPart: this.data.word.speechPart.id,
        gender: this.data.word.gender.id,
        forms: this.data.word.forms.join(', '),
        remarks: this.data.word.remarks
      });
    }
  }

  saveWord() {
    if (this.formGroup.value) {
      const form = this.formGroup.value;
      const wordDto = this.wordService.wordFromDto({
        id: this.data?.word.dbid,
        word: form.word,
        gender_id: form.gender,
        forms: form.forms.split(','),
        translations: form.translations.split(','),
        speech_part_id: form.speechPart,
        remarks: form.remarks,
        stress_letter_index: 0,
        original_language_id: form.fromLanguage,
        translated_language_id: form.toLanguage
      });

      this.wordService.addOrModifyWord(wordDto)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  getWordSpelling() {
    return this.formGroup.value.word.split('');
  }

  setStressLetter(i: number) {
    console.log(i);
    this.formGroup.patchValue({
      stressLetterIndex: i
    });
  }
}
