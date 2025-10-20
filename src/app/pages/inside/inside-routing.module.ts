import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsideComponent } from './inside.component';
import { DashbaordComponent } from '../../dashbaord/dashbaord.component';
import { CoursesComponent } from '../../courses/courses.component';
import { LayoutInsideComponent } from '../../layout-inside/layout-inside.component';
import { InsideCoursesComponent } from '../../inside-courses/inside-courses.component';
import { CourseDetailsComponent } from '../../course-details/course-details.component';
import { InsideCourseDetailsComponent } from '../../inside-course-details/inside-course-details.component';
import { MyCoursesComponent } from '../../my-courses/my-courses.component';

// inside-routing.module.ts
// inside-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: LayoutInsideComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashbaordComponent },
      {path:'courses',component:InsideCoursesComponent},
      {path:'course-details',component:InsideCourseDetailsComponent},
      {path:'mycourses',component:MyCoursesComponent},
      // Add other inside routes here
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsideRoutingModule {
 

 }
