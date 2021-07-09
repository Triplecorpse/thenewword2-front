import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SymbolsComponent } from './symbols.component';
import {MatChipsModule} from "@angular/material/chips";
import {TranslateModule} from "@ngx-translate/core";
import {SafeModule} from "../../pipes/safe/safe.module";
import {MatBadgeModule} from "@angular/material/badge";

@NgModule({
  declarations: [SymbolsComponent],
  exports: [SymbolsComponent],
  imports: [
    CommonModule,
    MatChipsModule,
    TranslateModule,
    SafeModule,
    MatBadgeModule
  ]
})
export class SymbolsModule { }
