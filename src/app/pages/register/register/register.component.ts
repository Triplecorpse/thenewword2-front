import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, switchMap, takeUntil} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ReCaptchaV3Service} from "ng-recaptcha";
import {Subject, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  login = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  passwordRepeat = new FormControl('',Validators.required);
  email = new FormControl();
  formGroup = new FormGroup({
    login: this.login,
    password: this.password,
    passwordRepeat: this.passwordRepeat,
    email: this.email
  });
  private destroy$ = new Subject();

  constructor(private httpClient: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.formGroup.valid) {
      this.recaptchaV3Service.execute('importantAction')
        .pipe(
          takeUntil(this.destroy$),
          switchMap(token => this.httpClient.post('user/register', {...this.formGroup.value, token})),
        )
        .subscribe();
    }
  }
}
