import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HowItWorksComponent} from './how-it-works.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HowItWorksComponent
  }
];

@NgModule({
  declarations: [
    HowItWorksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HowItWorksModule {
}
