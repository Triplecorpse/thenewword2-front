import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotUserGuard} from "./services/not-user-guard.service";
import {UserGuard} from "./services/user-guard.service";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main-page/main-page.module').then(m => m.MainPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [NotUserGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule),
    canActivate: [NotUserGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [UserGuard]
  },
  {
    path: 'word',
    loadChildren: () => import('./pages/word/word.module').then(m => m.WordModule),
    canActivate: [UserGuard]
  },
  {
    path: 'exercise',
    loadChildren: () => import('./pages/exercise/exercise.module').then(m => m.ExerciseModule),
    canActivate: [UserGuard]
  },
  {
    path: 'user-settings',
    loadChildren: () => import('./pages/user-settings/user-settings.module').then(m => m.UserSettingsModule),
    canActivate: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
