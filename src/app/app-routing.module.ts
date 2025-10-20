import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { InsideLayoutComponent } from './layouts/inside-layout/inside-layout.component';
import { OutsideLayoutComponent } from './layouts/outside-layout/outside-layout.component';
import { LayoutInsideComponent } from './layout-inside/layout-inside.component';

const routes: Routes = [
  {
    path: '',
    component: OutsideLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'course/:id', component: CourseDetailsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotpasswordComponent },
    ]
  },
    {
    path: 'app',
    loadChildren: () => import('./pages/inside/inside.module').then(m => m.InsideModule)
    // This loads the above configuration
  },
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
