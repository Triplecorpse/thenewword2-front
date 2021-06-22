import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WordComponent} from './word.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {ModalNewWordModule} from '../../components/modal-new-word/modal-new-word.module';
import {MatCardModule} from '@angular/material/card';
import {WordListComponent} from '../../components/word-list/word-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {ModalConfirmModule} from '../../components/modal-confirm/modal-confirm.module';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {TranslateModule} from '@ngx-translate/core';
import {ModalNewWordsetComponent} from "../../components/modal-new-wordset/modal-new-wordset.component";
import {ModalNewWordsetModule} from "../../components/modal-new-wordset/modal-new-wordset.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSortModule} from "@angular/material/sort";
import {WordListModule} from "../../components/word-list/word-list.module";

const routes: Routes = [
  {path: '', component: WordComponent}
];

@NgModule({
  declarations: [
    WordComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    ModalNewWordModule,
    ModalNewWordsetModule,
    ModalConfirmModule,
    TranslateModule.forChild({
      extend: true
    }),
    WordListModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule
  ]
})
export class WordModule {
}
