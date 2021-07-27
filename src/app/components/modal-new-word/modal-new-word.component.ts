import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
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
  symbolsDisabled: boolean;
  translationsAutocomplete: IWord[] = [];

  @ViewChild('wordControl', {read: ElementRef}) private wordControl: ElementRef;
  @ViewChild('translationsControl', {read: ElementRef}) private translationsControl: ElementRef;
  actionDisabled = false;

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

  setSymbol(symbol: string) {
    const selectionStart = this.wordControl.nativeElement.selectionStart;
    const selectionEnd = this.wordControl.nativeElement.selectionEnd;
    const newString1 = this.formGroup.controls.word.value.slice(0, selectionStart);
    const newString2 = this.formGroup.controls.word.value.slice(selectionEnd);
    const newString = `${newString1}${symbol}${newString2}`;

    this.formGroup.controls.word.patchValue(newString);
    this.wordControl.nativeElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
    this.wordControl.nativeElement.focus();
  }

  wordFocusOut() {
    this.symbolsDisabled = true;
    this.formGroup.controls.translations.disable();
    this.actionDisabled = true;
    this.wordService.findByUserInput({
      word: this.formGroup.value.word,
      originalLanguage: this.foreignLanguage,
      translatedLanguage: this.nativeLanguage
    })
      .subscribe((result) => {
        this.translationsAutocomplete = result
        this.formGroup.controls.translations.enable();
        this.translationsControl.nativeElement.focus();
        this.actionDisabled = false;
      })
  }

  displayFn(word: IWord): string {
    return word.translations?.join(', ') || '';
  }
}
