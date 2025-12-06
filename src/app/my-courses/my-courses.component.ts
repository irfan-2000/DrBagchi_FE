import { Component } from '@angular/core';
import { MyCoursesService } from '../my-courses.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-my-courses',
  standalone: false,
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent {
 

constructor(private mycourses:MyCoursesService,private Courses:CoursesService) 
{

this.  GetMyCourses( );

 }

  // IST Timezone example
  now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

  // Example: announcements, live class status, quizzes
  announcements = [
    {
      message: 'New Java mock test scheduled at 7:30 PM IST. Attempt now!',
      type: 'quiz',
      link: '/quiz/789',
      cta: 'Join Quiz',
      icon: '📝'
    },
    {
      message: 'Mathematics Advanced live class started for Morning Batch.',
      type: 'live',
      link: '/live/room/456',
      cta: 'Join Live',
      icon: '🔴'
    }
  ];

  enrolledCourses = [
    {
      id: 1,
      title: 'Java Backend Development - Live',
      batch: 'Morning Batch',
      image: 'https://localhost:7091/media/CourseImages/92228219-e988-49fd-b347-697eee936266.png',
      percent: 15,
      status: 'Ongoing',
      currentTopic: 'OOP Devices and RAM',
      startDate: '2025-06-11T09:00:00+05:30',
      endDate: '2025-09-30T10:00:00+05:30',
      live: {
        isLive: true,
        title: 'Inheritance and Polymorphism',
        joinUrl: 'https://zoom.us/123456',
        time: '2025-10-21T20:00:00+05:30', // IST
        batch: 'Morning Batch'
      },
      quizzing: {
        isQuizLive: true,
        title: 'Mock Test #2',
        link: '/quiz/857'
      }
    },
    {
      id: 2,
      title: 'DSA Accelerator',
      batch: 'Evening Batch',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      percent: 40,
      status: 'Completed',
      currentTopic: 'Recursion - Assignment 5',
      live: { isLive: false },
      quizzing: { isQuizLive: false }
    }
  ];

  // For tab navigation and for viewing single course details
  view: 'dashboard' | 'course' = 'dashboard';
  selectedCourse: any = null;
  activeTab = 'chapters';

  ISTString(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  // When user clicks a course card
  continueLearning(course: any) 
  {
    this.selectedCourse =this. enrolledCourses[0] ;//course;
    this.view = 'course';
      this.getCourseById(course.courseId);
  }


  RenewCourse(CourseId:any)
  {
///app/course-details?id=33
window.open(`/app/course-details?id=${CourseId}`,'_blank');
  }

  // When user goes back
  goBack() {
    this.view = 'dashboard';
    this.selectedCourse = null;
    this.activeTab = 'chapters';
  }

AvailableCourse:any = [];
Course:any
courseModules:any = [];

  GetMyCourses( )
  {
    this.mycourses.GetMyCourses().subscribe({
      next: (response: any) => 
        {
          this.AvailableCourse = response.result;
           
          console.log('My Courses:', this.AvailableCourse);
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    }); 

  }


  getCourseById(id: any) {
  try {
    this.Courses.GetCourseById_admin(id).subscribe({
      next: (response: any) => {
        if (!response) {
          console.warn('Empty response received');
          return;
        }
         
        // Extract both parts
        const item1 = response.Item1 || {};
        const item2 = response.Item2 || {};

        // Merge key fields from Item2 into Item1 if missing
        this.Course = {
          ...item1,
          ShortDescription: item2.ShortDescription || item1.ShortDescription || '',
          Overview: item2.Overview   || '',
          Duration: item2.Duration || '',
          Level: item2.Level || item1.CourseLevel || '',
          Highlights: item2.Highlights || item1.Highlights || [],
          Requirements: item1.Requirements || [],
          Objectives: item1.Objectives || [],
          Batches: item1.Batches || [],
          Installments: item1.Installments || [],
        };
 
        // Optional: Store separately if needed
      
        this.courseModules = response.Item3 || [];
        debugger
        console.log('Parsed Course:', this.Course);
        console.log(this.Course?.Highlights);
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}


  openLessons: boolean[] = [];

toggleLesson(index: number) {
  this.openLessons[index] = !this.openLessons[index];
}

isLessonOpen(index: number): boolean {
  return this.openLessons[index];
}


}
