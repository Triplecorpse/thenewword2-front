import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordComponent} from './forgot-password.component';
import {RouterModule, Routes} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent
  }
];

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatInputModule
  ]
})
export class ForgotPasswordModule {
}
