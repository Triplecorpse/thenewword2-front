import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordComponent } from './word/word.component';
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {ModalNewWordModule} from "../../components/modal-new-word/modal-new-word.module";

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
    ModalNewWordModule
  ]
})
export class WordModule { }
