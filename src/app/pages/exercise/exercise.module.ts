import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseComponent } from './exercise/exercise.component';
import {RouterModule, Routes} from "@angular/router";
import {MatCardModule} from "@angular/material/card";

const routes: Routes = [
  { path: '', component: ExerciseComponent }
];

@NgModule({
  declarations: [
    ExerciseComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule
    ]
})
export class ExerciseModule { }
