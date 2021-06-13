import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalNewWordsetComponent} from './modal-new-wordset.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [ModalNewWordsetComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule.forChild({
      extend: true
    })
  ]
})
export class ModalNewWordsetModule {
}
