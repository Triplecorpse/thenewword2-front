import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseComponent } from './exercise/exercise.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  { path: '', component: ExerciseComponent }
];

@NgModule({
  declarations: [
    ExerciseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ExerciseModule { }
