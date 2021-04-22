import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";

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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.formGroup.valid) {
      this.userService.register(this.formGroup.value).subscribe();
    }
  }
}
