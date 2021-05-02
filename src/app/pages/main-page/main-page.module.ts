import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import {Routes} from "@angular/router";

const routes: Routes = [
  { path: '', component: MainPageComponent }
];

@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainPageModule { }
