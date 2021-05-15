import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {takeUntil} from "rxjs/operators";

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
  formGroup = new FormGroup({
    login: this.login,
    password: this.password,
    passwordRepeat: this.passwordRepeat,
    email: this.email
  });
  private destroy$ = new Subject();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const error = value.password === value.passwordRepeat && this.passwordRepeat.touched ? null : {notequal: true};
        this.passwordRepeat.setErrors(error);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    console.log(this.login);
    console.log(this.passwordRepeat);
    console.log(this.email);
    if (this.formGroup.valid) {
      this.userService.register(this.formGroup.value).subscribe();
    }
  }
}
