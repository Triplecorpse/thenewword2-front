import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WordComponent} from './word/word.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {ModalNewWordModule} from '../../components/modal-new-word/modal-new-word.module';
import {MatCardModule} from '@angular/material/card';
import {WordListComponent} from '../../components/word-list/word-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {ModalConfirmModule} from '../../components/modal-confirm/modal-confirm.module';
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  {path: '', component: WordComponent}
];

@NgModule({
  declarations: [
    WordComponent,
    WordListComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    ModalNewWordModule,
    ModalConfirmModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule
  ]
})
export class WordModule {
}