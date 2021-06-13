import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IWordSet} from '../../interfaces/IWordSet';
import {User} from '../../models/User';

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

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: {wordSet: IWordSet}) { }

  ngOnInit(): void {
  }

  saveWordSet() {

  }
}
