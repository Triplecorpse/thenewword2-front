import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalNewWordComponent} from './modal-new-word.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";



@NgModule({
  declarations: [ModalNewWordComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class ModalNewWordModule { }
