import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IUser} from '../../interfaces/IUser';
import {Metadata} from '../../models/Metadata';
import {EMPTY, merge, Subject} from 'rxjs';
import {debounceTime, filter, map, switchMap, tap} from 'rxjs/operators';

interface ILanguageSection {
  lang: ILanguage;
  model: string;
  letters: { text: string, currentBadgeSize: 'small' | 'large' }[];
  action?: 'add' | 'remove';
}

export interface ISymbol {
  lang: ILanguage;
  letters: string[];
  action: 'add' | 'remove';
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  private languageSectionsChange = new Subject<ILanguageSection>();
  languages: ILanguage[] = [];
  settingsFormGroup = new FormGroup({
    login: new FormControl({value: '', disabled: true}),
    nativeLanguages: new FormControl({value: '', disabled: true}),
    learningLanguages: new FormControl()
  });
  securityFormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl(),
    newPasswordRepeat: new FormControl()
  });
  learningLanguagesTooltip: string;
  languageSections: ILanguageSection[];

  constructor(private userService: UserService) {
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

    merge(
      this.settingsFormGroup.controls.learningLanguages.valueChanges.pipe(map(v => ({learningLanguages: v}))),
      this.languageSectionsChange.pipe(map(v => ({languageSections: v})))
    )
      .pipe(
        filter(() => this.settingsFormGroup.valid),
        debounceTime(1000),
        switchMap<any, any>((value: {learningLanguages?: number[]; languageSections?: ILanguageSection}) => {
          console.log(value);
          if (value.learningLanguages) {
            const user: IUser = {
              learningLanguages: this.languages.filter(lang => value.learningLanguages.includes(lang.id))
            };

            return this.userService.update(user, this.settingsFormGroup.value.newPassword);
          }

          if (value.languageSections) {
            return this.userService.updateKeyboardSettings({
              lang: value.languageSections.lang,
              action: value.languageSections.action,
              letters: value.languageSections.letters.map(({text}) => text)
            });
          }

          return EMPTY;
        })
      )
      .subscribe(result => {
      });
  }

  addLetter(event: MouseEvent, id: number) {
    event.stopPropagation();
    const section = this.languageSections.find(sec => sec.lang.id === id);

    if (section.model) {
      section.letters.push({text: section.model, currentBadgeSize: 'small'});
      section.model = '';
    }

    this.languageSectionsChange.next({...section, action: 'add'});
  }

  changeBadgeSize(id: number, bi: number, desiredSize: 'small' | 'large') {
    const section = this.languageSections.find(sec => sec.lang.id === id);
    const button = section.letters[bi];

    button.currentBadgeSize = desiredSize;
  }

  removeLetter(id: number, bi: number) {
    const section = this.languageSections.find(sec => sec.lang.id === id);
    section.letters.splice(bi, 1);

    this.languageSectionsChange.next({...section, action: 'remove'});
  }
}
