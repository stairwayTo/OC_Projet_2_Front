import {Routes} from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentListComponent} from './pages/student-list/student-list.component';
import {authGuard} from './core/guard/auth.guard';
import {StudentDetailComponent} from './pages/student-detail/student-detail.component';
import {StudentFormComponent} from './pages/student-form/student-form.component';

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
  },
  // attention a l'ordre des route pour arriver sur bonne page
  {
    path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/new',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard]
  }
];
