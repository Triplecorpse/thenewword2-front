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
import {Metadata} from "../../models/Metadata";

export interface IWordModalInputData {
  word?: IWord;
  wordsetId?: number;
  wordsetNativeLanguage?: Language;
  wordsetForeignLanguage?: Language;
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
  nativeLanguage: ILanguage;
  foreignLanguage: ILanguage;
  formGroup = new FormGroup({
    word: new FormControl('', Validators.required),
    translations: new FormControl('', Validators.required),
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
  isShownMore: boolean;
  symbols: string[];
  shiftPressed: boolean;
  shiftWasPressed: boolean;
  numberStore: string = '';

  constructor(private dialogRef: MatDialogRef<any>,
              private wordService: WordService,
              private userService: UserService,
              private metadataService: MetadataService,
              private changeDetection: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: IWordModalInputData) {
  }

  ngOnInit(): void {
    this.wordMetadata = {
      languages: Metadata.languages,
      genders: Metadata.genders,
      speechParts: Metadata.speechParts,
      symbols: Metadata.symbols
    };

    this.nativeLanguages = this.userService.getUser().nativeLanguages;
    this.learningLanguages = this.userService.getUser().learningLanguages;

    if (!!this.data.word) {
      this.isEditing = true;
      this.idEditing = this.data.word.dbid;
      this.stressLetterIndex = this.data.word.stressLetterIndex;
      this.nativeLanguage = this.data.word.translatedLanguage;
      this.foreignLanguage = this.data.word.originalLanguage;
      this.formGroup.patchValue({
        word: this.data.word.word,
        translations: this.data.word.translations.join(', '),
        transcription: this.data.word.transcription,
        speechPart: this.data.word.speechPart.id,
        gender: this.data.word.gender.id,
        forms: this.data.word.forms.join(', '),
        remarks: this.data.word.remarks
      });
    }

    if (!!this.data.wordsetId) {
      this.wordSetId = this.data.wordsetId;
    }

    if (!!this.data.wordsetForeignLanguage) {
      this.nativeLanguage = this.data.wordsetNativeLanguage;
    }

    if (!!this.data.wordsetNativeLanguage) {
      this.foreignLanguage = this.data.wordsetForeignLanguage;
    }

    this.symbols = Metadata.symbols.find(s => s.lang.id === this.foreignLanguage.id)?.letters || [];
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
        original_language_id: this.foreignLanguage.id,
        translated_language_id: this.nativeLanguage.id,
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

  modKey($event: KeyboardEvent) {
    this.shiftPressed = $event.getModifierState('Shift');
  }

  listenNumber($event: KeyboardEvent) {
    const altPressed = $event.getModifierState('Alt');
    const digits = '0123456789';
    const match = $event.code.match(/\d{1}/);
    const digit = match && match[0];

    this.shiftWasPressed = $event.getModifierState('Shift');

    if (digit && digits.includes(digit) && altPressed) {
      this.numberStore += digit;
    }
  }

  clearNumberStore($event: KeyboardEvent) {
    const altPressed = $event.getModifierState('Alt');

    if (this.numberStore && !altPressed) {
      const index = +this.numberStore - 1;
      const symbol = this.symbols[index]
        ? this.shiftWasPressed
          ? this.symbols[index].toUpperCase()
          : this.symbols[index]
        : '';

      this.formGroup.controls.word.patchValue(this.formGroup.controls.word.value + symbol);
      this.numberStore = '';
      this.shiftWasPressed = false;
    }
  }
}
