import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WordListComponent} from "./word-list.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [WordListComponent],
  exports: [WordListComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressBarModule
  ]
})
export class WordListModule {
}
