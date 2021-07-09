import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExerciseComponent} from './exercise.component';
import {RouterModule, Routes} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {TranslateModule} from "@ngx-translate/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {WordModule} from "../word/word.module";
import {WordListModule} from "../../components/word-list/word-list.module";
import {SymbolsModule} from "../../components/symbols/symbols.module";

const routes: Routes = [
  {path: '', component: ExerciseComponent}
];

@NgModule({
  declarations: [
    ExerciseComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatListModule,
        MatGridListModule,
        TranslateModule,
        MatSelectModule,
        MatSliderModule,
        MatCheckboxModule,
        MatTooltipModule,
        WordListModule,
        FormsModule,
        SymbolsModule
    ]
})
export class ExerciseModule {
}
