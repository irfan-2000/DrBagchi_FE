import { Component } from '@angular/core';

@Component({
  selector: 'app-my-courses',
  standalone: false,
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent {
 
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
  continueLearning(course: any) {
    this.selectedCourse = course;
    this.view = 'course';
  }

  // When user goes back
  goBack() {
    this.view = 'dashboard';
    this.selectedCourse = null;
    this.activeTab = 'chapters';
  }
}
