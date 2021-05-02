import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalNewWordComponent} from './modal-new-word.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [ModalNewWordComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatDialogModule
    ]
})
export class ModalNewWordModule { }
