import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ReCaptchaV3Service} from "ng-recaptcha";
import {Subject} from "rxjs";
import {switchMap, switchMapTo, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginInput = new FormControl('', Validators.required);
  passwordInput = new FormControl('', Validators.required);
  saveSession = new FormControl();
  private destroy$ = new Subject();

  formGroup = new FormGroup({
    login: this.loginInput,
    password: this.passwordInput,
    saveSession: this.saveSession
  });

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
          switchMap(token => this.httpClient.post('login', {...this.formGroup.value, token}))
        )
        .subscribe();
    }
  }
}
