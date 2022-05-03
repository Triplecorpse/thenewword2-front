import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LearnComponent} from './learn.component';
import {AskWordModule} from '../../components/ask-word/ask-word.module';
import {Route, RouterModule} from '@angular/router';
import {ExamComponent} from '../exam/exam.component';

const routes: Route[] = [
  {path: '', component: ExamComponent}
];

@NgModule({
  declarations: [
    LearnComponent
  ],
  imports: [
    CommonModule,
    AskWordModule,
    RouterModule.forChild(routes)
  ]
})
export class LearnModule {
}
