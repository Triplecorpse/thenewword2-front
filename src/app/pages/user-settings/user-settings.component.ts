import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IUser} from '../../interfaces/IUser';
import {Metadata} from '../../models/Metadata';
import {EMPTY, merge, Subject} from 'rxjs';
import {debounceTime, filter, map, switchMap, switchMapTo} from 'rxjs/operators';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {ISymbol} from "../../interfaces/ISymbol";
import {User} from "../../models/User";

interface ILanguageSection {
  lang: ILanguage;
  model: string;
  letters: { text: string, currentBadgeSize: 'small' | 'large' }[];
  action?: 'add' | 'remove';
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  private languageSectionsChange = new Subject<ILanguageSection>();
  private keymapperValueChange = new Subject<boolean>();
  languages: ILanguage[] = [];
  settingsFormGroup = new FormGroup({
    login: new FormControl({value: '', disabled: true}),
    nativeLanguages: new FormControl(),
    learningLanguages: new FormControl()
  });
  securityFormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.minLength(6)),
    newPasswordRepeat: new FormControl('', Validators.minLength(6))
  });
  learningLanguagesTooltip: string;
  languageSections: ILanguageSection[];
  defaultKeys: { [key: number]: string[] } = {};
  keymaper = User.mapCyrillic;

  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.languages = Metadata.languages
      .sort((a, b) => a.englishName > b.englishName ? 1 : -1);
    this.settingsFormGroup.valueChanges
      .subscribe(val => {
        this.languageSections = this.languages
          .filter(lang => val.learningLanguages.includes(lang.id))
          .map(lang => ({
            lang,
            model: '',
            letters: []
          }));
        this.learningLanguagesTooltip = this.languageSections
          .map(({lang}) => lang)
          .map(lang => lang.englishName)
          .join(', ');
      });
    this.settingsFormGroup.setValue({
      login: this.userService.getUser().login,
      nativeLanguages: this.userService.getUser().nativeLanguages.map(({id}) => id),
      learningLanguages: this.userService.getUser().learningLanguages.map(({id}) => id)
    });
    Metadata.symbols.forEach(symbol => {
      this.defaultKeys[symbol.lang.id] = symbol.letters;
    });

    merge(
      this.settingsFormGroup.controls.learningLanguages.valueChanges.pipe(map(v => ({learningLanguages: v}))),
      this.settingsFormGroup.controls.nativeLanguages.valueChanges.pipe(map(v => ({nativeLanguages: v}))),
      this.languageSectionsChange.pipe(map(v => ({languageSections: v}))),
      this.keymapperValueChange.pipe(map(v => ({keymapper: v})))
    )
      .pipe(
        filter(() => this.settingsFormGroup.valid),
        debounceTime(1000),
        switchMap<any, any>((value: { learningLanguages?: number[]; nativeLanguages?: number[]; languageSections?: ILanguageSection, keymapper?: boolean }) => {
          if (value.learningLanguages) {
            const user: IUser = {
              learningLanguages: this.languages.filter(lang => value.learningLanguages.includes(lang.id))
            };

            return this.userService.update(user, this.settingsFormGroup.value.newPassword)
              .pipe(
                switchMapTo(this.translateService.get('SETTINGS.USER_SETTINGS.RESPONSES.USER_UPDATED'))
              );
          }

          if (value.nativeLanguages) {
            const user: IUser = {
              nativeLanguages: this.languages.filter(lang => value.nativeLanguages.includes(lang.id))
            };

            return this.userService.update(user, this.settingsFormGroup.value.newPassword)
              .pipe(
                switchMapTo(this.translateService.get('SETTINGS.USER_SETTINGS.RESPONSES.USER_UPDATED'))
              );
          }

          if (value.languageSections) {
            return this.userService.updateKeyboardSettings({
              lang: value.languageSections.lang,
              action: value.languageSections.action,
              letters: value.languageSections.letters.map(({text}) => text)
            })
              .pipe(
                switchMap((result: ISymbol) => {
                  if (result.action === 'add') {
                    return this.translateService
                      .get(
                        'SETTINGS.KEYBOARD_SETTINGS.RESPONSES.KEY_ADDED',
                        {
                          letter: result.letters.join(', '),
                          language: result.lang.nativeName
                        });
                  } else if (result.action === 'remove') {
                    return this.translateService
                      .get(
                        'SETTINGS.KEYBOARD_SETTINGS.RESPONSES.KEY_REMOVED',
                        {
                          letter: result.letters.join(', '),
                          language: result.lang.nativeName
                        });
                  }

                  return EMPTY;
                })
              );
          }

          if (typeof value.keymapper !== 'undefined') {
            const user: IUser = {
              mapCyrillic: value.keymapper
            };

            return this.userService.update(user, this.settingsFormGroup.value.newPassword)
              .pipe(
                switchMapTo(this.translateService.get('SETTINGS.USER_SETTINGS.RESPONSES.USER_UPDATED'))
              );
          }

          return EMPTY;
        }),
        filter(result => !!result)
      )
      .subscribe(result => {
        this.snackBar.open(result as string, '', {duration: 10000});
      });
  }

  securityFormSubmit() {
    if (this.securityFormGroup.valid) {
      this.userService.update({
        password: this.securityFormGroup.value.oldPassword,
        email: this.securityFormGroup.value.email
      }, this.securityFormGroup.value.newPassword)
        .pipe(switchMapTo(this.translateService.get('SETTINGS.SECURITY_SETTINGS.RESPONSES.USER_UPDATED')))
        .subscribe(result => {
          this.snackBar.open(result as string, '', {duration: 10000});
        });
    }
  }

  keymapperChange() {
    this.keymapperValueChange.next(this.keymaper);
  }
}
