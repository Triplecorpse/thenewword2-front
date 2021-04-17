import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { AddWordComponent } from './add-word/add-word.component';

const routes: Routes = [
  {path: '', component: AddWordComponent}
]

@NgModule({
  declarations: [
    AddWordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AddWordModule { }
