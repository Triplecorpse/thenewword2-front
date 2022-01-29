import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegistrationFormComponent} from './registration-form.component';
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [RegistrationFormComponent],
  exports: [
    RegistrationFormComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule
  ]
})
export class RegistrationFormModule { }
