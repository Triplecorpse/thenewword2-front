import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LearnWordComponent} from './learn-word.component';
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SymbolsModule} from "../symbols/symbols.module";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [LearnWordComponent],
  exports: [LearnWordComponent],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SymbolsModule,
    TranslateModule
  ]
})
export class LearnWordModule { }
