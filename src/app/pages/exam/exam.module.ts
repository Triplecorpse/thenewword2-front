import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExamComponent} from './exam.component';
import {AskWordModule} from '../../components/ask-word/ask-word.module';
import {Route, RouterModule} from '@angular/router';

const routes: Route[] = [
  {path: '', component: ExamComponent}
];

@NgModule({
  declarations: [
    ExamComponent,
  ],
  imports: [
    CommonModule,
    AskWordModule,
    RouterModule.forChild(routes)
  ]
})
export class ExamModule {
}
