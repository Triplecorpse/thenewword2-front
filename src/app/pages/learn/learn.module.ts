import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LearnComponent} from './learn.component';
import {AskWordModule} from '../../components/ask-word/ask-word.module';
import {Route, RouterModule} from '@angular/router';
import {LearnWordModule} from '../../components/learn-word/learn-word.module';

const routes: Route[] = [
  {path: '', component: LearnComponent}
];

@NgModule({
  declarations: [
    LearnComponent
  ],
  imports: [
    CommonModule,
    AskWordModule,
    RouterModule.forChild(routes),
    LearnWordModule
  ]
})
export class LearnModule {
}
