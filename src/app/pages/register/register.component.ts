import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {UserService} from '../../services/user.service';
import {finalize, switchMapTo, takeUntil} from 'rxjs/operators';
import {ILanguage} from '../../interfaces/ILanguage';
import {WordService} from '../../services/word.service';
import {IUser} from '../../interfaces/IUser';
import {MetadataService} from '../../services/metadata.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Metadata} from "../../models/Metadata";
import {AsyncValidatorService} from "../../services/async-validator.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  formGroup = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]+$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordRepeat: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.email]),
    nativeLanguages: new FormControl([], Validators.required),
    learningLanguages: new FormControl([], Validators.required)
  });
  languages: ILanguage[] = [];
  recommendedLanguages: ILanguage[] = [];
  isLoading = false;

  constructor(private userService: UserService,
              private wordService: WordService,
              private metadataService: MetadataService,
              private snackBar: MatSnackBar,
              private translateService: TranslateService,
              private asyncValidatorsService: AsyncValidatorService) {
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const repeatValid = value.passwordRepeat || this.formGroup.controls.passwordRepeat.touched && !value.passwordRepeat;
        const error = value.password === value.passwordRepeat && repeatValid ? null : {notequal: true};

        this.formGroup.controls.passwordRepeat.setErrors(error);
      });

    this.languages = Metadata.languages;

    if (this.metadataService.isBrowser) {
      const userLangs = navigator.languages.map(l => {
        const langLocale = l.split('-');
        return langLocale[0];
      });

      const uniqUserLangs = [...new Set(userLangs)];

      this.recommendedLanguages = uniqUserLangs.map(iso2 => this.languages.find(lang => lang.iso2 === iso2));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(form: FormGroupDirective) {
    if (this.formGroup.valid) {
      const user: IUser = {
        login: this.formGroup.value.login,
        password: this.formGroup.value.password,
        email: this.formGroup.value.email,
        nativeLanguages: this.languages.filter(lang => this.formGroup.value.nativeLanguages.includes(lang.id)),
        learningLanguages: this.languages.filter(lang => this.formGroup.value.learningLanguages.includes(lang.id))
      };
      this.isLoading = true;
      this.formGroup.disable();
      this.userService.register(user)
        .pipe(
          finalize(() => {
            this.formGroup.enable();
            this.isLoading = false;
          }),
          switchMapTo(this.translateService.get('REGISTRATION.SUCCESS'))
        )
        .subscribe(message => {
          this.snackBar.open(message, '', {duration: 10000});
          form.resetForm();
          this.formGroup.setErrors({});
        });
    }
  }

  getLanguagesValue(languagesModel: number[]): string[] {
    if (!languagesModel || !languagesModel.length) {
      return [];
    }

    return this.languages
      .filter(lang => languagesModel.includes(lang.id))
      .map(lang => lang.nativeName);
  }
}
