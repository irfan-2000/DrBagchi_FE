import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../courses.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-inside-courses',
  standalone: false,
  templateUrl: './inside-courses.component.html',
  styleUrl: './inside-courses.component.css'
})
export class InsideCoursesComponent {
AvailableCourses:any = [];
 course: any = {};
  highlights: string[] = [];
  requirements: string[] = [];
  courseOverview = '';
  shortDescription = '';
  courseDuration = '';
  courseLevel = '';
  constructor(private Courses:CoursesService,private router:Router)
  {
  this.getAllCourses();
   
  } 
  safeParse(value: any, defaultValue: any) {
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

getAllCourses()
{
    try 
     {
        this. Courses.getAllCourses( ).subscribe({
          next: (response: any) =>
        {
           
this.AvailableCourses = response.result.map((c: any) => {
  return {
    ...c,
    Description: this.safeParse(c.Description, { ShortDescription: c.Description }),
    Objectives: this.safeParse(c.Objectives, [c.Objectives]),
    Requirements: this.safeParse(c.Requirements, [c.Requirements])
  };
});
debugger
console.log(this.AvailableCourses);
 
          },
          error: (error: any) =>
             {
              debugger
              if(error.error.status == 401)
                {
                   this.router.navigate(['/login']);

                }             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

}

goToCourseDetails(course: any) 
{
   
  this.router.navigate(['/app/course-details'], { queryParams: { id: course.CourseId } });
}

}
