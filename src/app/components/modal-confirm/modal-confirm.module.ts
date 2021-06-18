import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmComponent } from './modal-confirm.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [
    ModalConfirmComponent
  ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        TranslateModule
    ]
})
export class ModalConfirmModule { }
