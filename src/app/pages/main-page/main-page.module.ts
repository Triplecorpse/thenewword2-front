import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainPageComponent} from './main-page.component';
import {RouterModule, Routes} from '@angular/router';
import {MatCardModule} from "@angular/material/card";
import {TranslateModule} from "@ngx-translate/core";
import {RegistrationFormModule} from "../../components/registration-form/registration-form.module";
import {MatButtonModule} from '@angular/material/button';

const routes: Routes = [
  {path: '', component: MainPageComponent}
];

@NgModule({
  declarations: [
    MainPageComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        TranslateModule,
        RegistrationFormModule,
        MatButtonModule
    ]
})
export class MainPageModule {
}
