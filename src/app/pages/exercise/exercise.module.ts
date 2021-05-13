import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExerciseComponent} from './exercise/exercise.component';
import {RouterModule, Routes} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";

const routes: Routes = [
  {path: '', component: ExerciseComponent}
];

@NgModule({
  declarations: [
    ExerciseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatListModule,
    MatGridListModule,
  ]
})
export class ExerciseModule {
}
