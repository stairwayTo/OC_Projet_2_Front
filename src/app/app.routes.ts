import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentListComponent} from './pages/student-list/student-list.component';
import {authGuard} from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard]
  }

];
