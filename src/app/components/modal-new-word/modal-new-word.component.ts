import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WordService} from '../../services/word.service';
import {IWord} from '../../interfaces/IWord';
import {IWordMetadata} from '../../interfaces/IWordMetadata';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {MetadataService} from '../../services/metadata.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {Language} from '../../models/Language';

export interface IWordModalInputData {
  word?: IWord;
  wordsetId?: number;
  wordsetLanguage?: Language;
}

@Component({
  selector: 'app-modal-new-word',
  templateUrl: './modal-new-word.component.html',
  styleUrls: ['./modal-new-word.component.scss']
})
export class ModalNewWordComponent implements OnInit {
  isEditing = false;
  wordMetadata: IWordMetadata;
  nativeLanguages: ILanguage[];
  learningLanguages: ILanguage[];
  formGroup = new FormGroup({
    word: new FormControl('', Validators.required),
    translations: new FormControl('', Validators.required),
    foreignLanguage: new FormControl('', Validators.required),
    nativeLanguage: new FormControl('', Validators.required),
    transcription: new FormControl(''),
    speechPart: new FormControl(''),
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
              @Inject(MAT_DIALOG_DATA) public data: IWordModalInputData) {
  }

  ngOnInit(): void {
    this.wordMetadata = {
      languages: this.metadataService.languages,
      genders: this.metadataService.genders,
      speechParts: this.metadataService.speechParts
    };

    this.nativeLanguages = this.userService.getUser().nativeLanguages;
    this.learningLanguages = this.userService.getUser().learningLanguages;

    this.formGroup.patchValue({
      nativeLanguage: this.nativeLanguages.map(({id}) => id)
    });

    if (!!this.data.word) {
      this.isEditing = true;
      this.idEditing = this.data.word.dbid;
      this.stressLetterIndex = this.data.word.stressLetterIndex;
      this.formGroup.patchValue({
        word: this.data.word.word,
        translations: this.data.word.translations.join(', '),
        transcription: this.data.word.transcription,
        foreignLanguage: this.data.word.originalLanguage.id,
        nativeLanguage: this.data.word.translatedLanguage.id,
        speechPart: this.data.word.speechPart.id,
        gender: this.data.word.gender.id,
        forms: this.data.word.forms.join(', '),
        remarks: this.data.word.remarks
      });
    }

    if (!!this.data.wordsetId) {
      this.wordSetId = this.data.wordsetId;
    }

    if (!!this.data.wordsetLanguage) {
      this.formGroup.patchValue({
        foreignLanguage: this.data.wordsetLanguage.id
      });
    }
  }

  saveWord() {
    if (this.formGroup.value) {
      const form = this.formGroup.value;
      const wordDto = this.wordService.wordFromDto({
        id: this.idEditing,
        transcription: form.transcription,
        word: form.word,
        gender_id: form.gender,
        forms: form.forms.split(','),
        translations: form.translations.split(','),
        speech_part_id: form.speechPart,
        remarks: form.remarks,
        stress_letter_index: this.stressLetterIndex,
        original_language_id: form.foreignLanguage,
        translated_language_id: form.nativeLanguage,
        word_set_id: this.wordSetId
      });

      this.wordService.addOrModifyWord(wordDto, this.wordSetId)
        .subscribe(word => {
          this.dialogRef.close(word);
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
