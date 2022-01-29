import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserSettingsComponent} from './user-settings.component';
import {RouterModule, Routes} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {TranslateModule} from '@ngx-translate/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
        MatTooltipModule,
        MatIconModule,
        FormsModule,
        MatBadgeModule,
        TranslateModule,
        MatChipsModule,
        MatCheckboxModule
    ]
})
export class UserSettingsModule {
}
