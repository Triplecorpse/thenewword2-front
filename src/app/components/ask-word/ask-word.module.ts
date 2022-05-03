import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskWordComponent } from './ask-word.component';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SymbolsModule} from '../symbols/symbols.module';
import {MatListModule} from '@angular/material/list';
import {TranslateModule} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [
    AskWordComponent
  ],
  exports: [
    AskWordComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SymbolsModule,
    MatListModule,
    TranslateModule,
    MatTooltipModule
  ]
})
export class AskWordModule { }
