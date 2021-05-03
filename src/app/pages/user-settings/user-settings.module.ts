import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import {RouterModule, Routes} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";

const routes: Routes = [
  {path: '', component: UserSettingsComponent}
];

@NgModule({
  declarations: [
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class UserSettingsModule { }
