import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', component: UserSettingsComponent}
];

@NgModule({
  declarations: [
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserSettingsModule { }
