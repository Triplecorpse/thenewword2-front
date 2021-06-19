import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
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
  stressLetterIndex: number;
  idEditing: number;
  wordSetId: number;

  constructor(private dialogRef: MatDialogRef<any>,
              private wordService: WordService,
              private userService: UserService,
              private metadataService: MetadataService,
              private changeDetection: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: IWord | number | undefined) { }

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
    if (typeof this.data === 'object') {
      this.isEditing = true;
      this.idEditing = this.data.dbid;
      this.formGroup.setValue({
        word: this.data.word,
        translations: this.data.translations.join(', '),
        fromLanguage: this.data.originalLanguage.id,
        toLanguage: this.data.translatedLanguage.id,
        speechPart: this.data.speechPart.id,
        gender: this.data.gender.id,
        forms: this.data.forms.join(', '),
        remarks: this.data.remarks
      });
    } else if (typeof this.data === 'number') {
      this.wordSetId = this.data;
    }
  }

  saveWord() {
    if (this.formGroup.value) {
      const form = this.formGroup.value;
      const wordDto = this.wordService.wordFromDto({
        id: this.idEditing,
        transcription: form.tramscription,
        word: form.word,
        gender_id: form.gender,
        forms: form.forms.split(','),
        translations: form.translations.split(','),
        speech_part_id: form.speechPart,
        remarks: form.remarks,
        stress_letter_index: 0,
        original_language_id: form.fromLanguage,
        translated_language_id: form.toLanguage,
        word_set_id: this.wordSetId
      });

      this.wordService.addOrModifyWord(wordDto, this.wordSetId)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  getWordSpelling() {
    return this.formGroup.value.word.split('');
  }

  setStressLetter(i: number) {
    if (i !== this.stressLetterIndex) {
      this.stressLetterIndex = i;
    } else {
      this.stressLetterIndex = undefined;
    }

    this.formGroup.patchValue({
      stressLetterIndex: this.stressLetterIndex
    });

    this.changeDetection.markForCheck();
  }
}
