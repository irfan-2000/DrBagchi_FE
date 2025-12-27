import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsideRoutingModule } from './inside-routing.module';
import { InsideComponent } from './inside.component';
import { MyCoursesService } from '../../my-courses.service';
import { CoursesService } from '../../courses.service';


@NgModule({
  declarations: [
    InsideComponent
  ],
  imports: [
    CommonModule,
    InsideRoutingModule
  ],
  providers: [MyCoursesService, CoursesService]
})
export class InsideModule { }
