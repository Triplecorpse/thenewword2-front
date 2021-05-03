import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ILanguage} from "../../../interfaces/ILanguage";
import {WordService} from "../../../services/word.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  username: string;
  languages$: Observable<ILanguage[]>;

  constructor(private userService: UserService, private wordService: WordService) { }

  ngOnInit(): void {
    this.username = this.userService.getUser().login;
    this.languages$ = this.wordService.getWordMetadata$()
      .pipe(map(metadata => metadata.languages));
  }

}
