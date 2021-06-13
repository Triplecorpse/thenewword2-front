import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ILanguage} from '../../interfaces/ILanguage';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {IUser} from '../../interfaces/IUser';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  languages: ILanguage[] = [];
  formGroup = new FormGroup({
    login: new FormControl({value: '', disabled: true}),
    nativeLanguage: new FormControl({value: '', disabled: true}),
    learningLanguages: new FormControl(),
    email: new FormControl('', Validators.email),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl(),
    newPasswordRepeat: new FormControl()
  });
  learningLanguagesTooltip: string;
  languageSections: {
    lang: ILanguage,
    model: string,
    letters: {text: string, currentBadgeSize: 'small' | 'large'}[]
  }[];

  constructor(private userService: UserService,
              private metadataService: MetadataService) {
  }

  ngOnInit(): void {
    this.languages = this.metadataService.languages;
    this.formGroup.valueChanges
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
    this.formGroup.setValue({
      login: this.userService.getUser().login,
      nativeLanguage: this.userService.getUser().nativeLanguage.id,
      learningLanguages: this.userService.getUser().learningLanguages.map(lang => lang.id),
      email: this.formGroup.value.email || '',
      oldPassword: this.formGroup.value.oldPassword || '',
      newPassword: this.formGroup.value.newPassword || '',
      newPasswordRepeat: this.formGroup.value.newPasswordRepeat || '',
    });
    this.formGroup.value.learningLanguages.forEach((langId: number) => {

    });
  }

  submit() {
    if (this.formGroup.valid) {
      const user: IUser = {
        learningLanguages: this.languages.filter(lang => this.formGroup.value.learningLanguages.includes(lang.id)),
        email: this.formGroup.value.email,
        password: this.formGroup.value.oldPassword,
        login: this.userService.getUser().login
      };

      this.userService.update(user, this.formGroup.value.newPassword).subscribe();
    }
  }

  addLetter(id: number) {
    const section = this.languageSections.find(sec => sec.lang.id === id);

    if (section.model) {
      section.letters.push({text: section.model, currentBadgeSize: 'small'});
      section.model = '';
    }
  }

  changeBadgeSize(id: number, bi: number, desiredSize: 'small' | 'large') {
    const section = this.languageSections.find(sec => sec.lang.id === id);
    const button = section.letters[bi];

    button.currentBadgeSize = desiredSize;
  }

  removeLetter(id: number, bi: number) {
    const section = this.languageSections.find(sec => sec.lang.id === id);
    section.letters.splice(bi, 1);
  }
}
