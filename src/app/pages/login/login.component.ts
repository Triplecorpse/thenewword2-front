import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginInput = new FormControl('', [Validators.required, Validators.minLength(6)]);
  passwordInput = new FormControl('', [Validators.required, Validators.minLength(6)]);
  saveSession = new FormControl();
  private destroy$ = new Subject();

  formGroup = new FormGroup({
    login: this.loginInput,
    password: this.passwordInput,
    saveSession: this.saveSession
  });

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.formGroup.valid) {
      this.userService.login(this.formGroup.value).subscribe();
    }
  }
}
