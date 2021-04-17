import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountComponent} from './account/account.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', component: AccountComponent},
  {path: 'add-word', loadChildren: () => import('../../pages/add-word/add-word.module').then(m => m.AddWordModule)}
]

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountModule {
}
