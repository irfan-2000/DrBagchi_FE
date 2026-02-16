import { Component } from '@angular/core';

@Component({
  selector: 'app-dashbaord',
  standalone: false,
  templateUrl: './dashbaord.component.html',
  styleUrl: './dashbaord.component.css'
})
export class DashbaordComponent
 {

  user = {
    name: 'Student Name',
    email: '[email protected]',
    profileImage: 'https://i.pravatar.cc/100?img=5'
  };

  notifications = [
    { message: 'Biology Class scheduled for tomorrow', type: 'info' },
    { message: 'Payment received for Course #BIO101', type: 'success' },
  ];

  enrolledCourses = [
    {
      id: 1,
      name: 'NEET Biology 2026',
      thumbnail: 'https://via.placeholder.com/150',
      attendedThisMonth: 6,
      conductedThisMonth: 8,
      daysLeft: 5,
      nextClass: {
        title: 'Human Physiology - Revision',
        date: '18 Feb 2026',
        time: '6:00 PM'
      }
    },
    {
      id: 2,
      name: 'Physics Crash Course',
      thumbnail: 'https://via.placeholder.com/150',
      attendedThisMonth: 4,
      conductedThisMonth: 6,
      daysLeft: 25,
      nextClass: {
        title: 'Thermodynamics Concepts',
        date: '19 Feb 2026',
        time: '5:00 PM'
      }
    },
    {
      id: 3,
      name: 'Organic Chemistry Mastery',
      thumbnail: 'https://via.placeholder.com/150',
      attendedThisMonth: 3,
      conductedThisMonth: 5,
      daysLeft: 3,
      nextClass: {
        title: 'Hydrocarbons Advanced',
        date: '20 Feb 2026',
        time: '7:00 PM'
      }
    }
  ];

 

  availableCourses = [
    { name: 'Math Foundation', price: 499 },
    { name: 'English Grammar', price: 399 }
  ];

  upcomingClasses = [
    {
      course: 'NEET Biology 2026',
      title: 'Human Physiology - Revision',
      date: '18 Feb 2026',
      time: '6:00 PM',
      duration: 90
    },
    {
      course: 'Physics Crash Course',
      title: 'Thermodynamics Concepts',
      date: '19 Feb 2026',
      time: '5:00 PM',
      duration: 60
    },
    {
      course: 'Organic Chemistry Mastery',
      title: 'Hydrocarbons Advanced',
      date: '20 Feb 2026',
      time: '7:00 PM',
      duration: 75
    }
  ];

    // ================= EXPIRING COURSES =================
  expiringCourses :any= [];

  // ================= DASHBOARD STATS =================
  avgClassesAttended = 0;

  payments = [
    { course: 'Biology 101', date: '2025-08-21', amount: 699, status: 'Paid' },
    { course: 'Physics Fundamentals', date: '2025-08-10', amount: 599, status: 'Pending' }
  ];

  sidebarOpen = false;
   ngOnInit() {}
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

    calculateExpiringCourses() {
    this.expiringCourses = this.enrolledCourses.filter(c => c.daysLeft <= 7);
  }

  // ================= CALCULATE AVERAGE ATTENDANCE =================
  calculateAverageAttendance() {

    let totalAttended = 0;
    let totalCourses = this.enrolledCourses.length;

    this.enrolledCourses.forEach(c => {
      totalAttended += c.attendedThisMonth;
    });

    this.avgClassesAttended =
      totalCourses > 0
        ? Math.round(totalAttended / totalCourses)
        : 0;
  }

}
