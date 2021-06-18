import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IWordSet} from '../../interfaces/IWordSet';
import {User} from '../../models/User';
import {WordService} from "../../services/word.service";

@Component({
  selector: 'app-modal-new-wordset',
  templateUrl: './modal-new-wordset.component.html',
  styleUrls: ['./modal-new-wordset.component.scss']
})
export class ModalNewWordsetComponent implements OnInit {
  isEditing = false;
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    toLanguage: new FormControl('', Validators.required),
    fromLanguage: new FormControl(User.nativeLanguage.id, Validators.required)
  });
  learningLanguages = User.learningLanguages;
  nativeLanguage = User.nativeLanguage;

  constructor(private wordService: WordService,
              private dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: {wordSet: IWordSet}) { }

  ngOnInit(): void {
    this.isEditing = !!this.data.wordSet;

    if (this.isEditing) {
      this.formGroup.patchValue({
        name: this.data.wordSet.name,
        toLanguage: this.data.wordSet.translatedlanguage.id,
        fromLanguage: this.data.wordSet.originalLanguage.id,
      });

      this.formGroup.controls.toLanguage.disable();
      this.formGroup.controls.fromLanguage.disable();
    }
  }

  saveWordSet() {
    if (this.formGroup.value) {
      const form = this.formGroup.value;
      const wordSetDto = this.wordService.wordSetFromDto({
        id: this.data?.wordSet.id,
        name: form.name,
        translated_language_id: form.toLanguage,
        original_language_id: form.fromLanguage
      });

      this.wordService.addOrModifyWordSet(wordSetDto)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }
}
