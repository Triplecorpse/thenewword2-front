import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {RouterModule, Routes} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';

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
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTooltipModule
  ]
})
export class UserSettingsModule {
}
