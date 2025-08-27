import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../courses.service';
import { Route, Router } from '@angular/router';

type SortKey = 'popular' | 'rating' | 'new' | 'priceAsc' | 'priceDesc';

  
@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent  {
    
    AvailableCourses:any = [];

  constructor(private Courses:CoursesService,private router:Router)
  {
  this.getAllCourses();
  }

 
  



  
getAllCourses()
{
    try 
     {
        this. Courses.getAllCourses( ).subscribe({
          next: (response: any) =>
        {
          this.AvailableCourses = response.result;

          console.log(response);


          },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

}

goToCourseDetails(course: any) 
{
   
  this.router.navigate(['/course-details'], { queryParams: { id: course.CourseId } });
}

}
