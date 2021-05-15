import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {take, takeUntil} from 'rxjs/operators';
import {ILanguage} from '../../../interfaces/ILanguage';
import {WordService} from '../../../services/word.service';
import {HttpClient} from '@angular/common/http';
import {IUser} from "../../../interfaces/IUser";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  login = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]+$/)]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  passwordRepeat = new FormControl('', [Validators.required, Validators.minLength(6)]);
  email = new FormControl('', Validators.email);
  nativeLanguage = new FormControl('', Validators.required);
  learningLanguages = new FormControl('', Validators.required);
  formGroup = new FormGroup({
    login: this.login,
    password: this.password,
    passwordRepeat: this.passwordRepeat,
    email: this.email,
    nativeLanguage: this.nativeLanguage,
    learningLanguages: this.learningLanguages
  });
  languages: ILanguage[] = [];
  private destroy$ = new Subject();

  constructor(private userService: UserService,
              private wordService: WordService) {
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const repeatValid = value.passwordRepeat || this.passwordRepeat.touched && !value.passwordRepeat;
        const error = value.password === value.passwordRepeat && repeatValid ? null : {notequal: true};

        this.passwordRepeat.setErrors(error);
      });
    this.wordService.getWordMetadata$()
      .pipe(take(1))
      .subscribe(result => {
        this.languages = result.languages;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.formGroup.valid) {
      const user: IUser = {
        login: this.formGroup.value.login,
        password: this.formGroup.value.password,
        email: this.formGroup.value.email,
        nativeLanguage: this.languages.find(lang => lang.id === this.formGroup.value.nativeLanguage),
        learningLanguages: this.languages.filter(lang => this.formGroup.value.learningLanguages.includes(lang.id))
      };
      this.userService.register(user).subscribe();
    }
  }

  getLanguagesValue(languagesModel: number[]): string[] {
    return this.languages
      .filter(lang => languagesModel.includes(lang.id))
      .map(lang => lang.englishName);
  }
}
