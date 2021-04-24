import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)},
  {path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)},
  {path: 'word', loadChildren: () => import('./pages/word/word.module').then(m => m.WordModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
