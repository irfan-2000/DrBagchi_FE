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
    { name: 'Biology 101', completed: 60, paymentStatus: 'Paid' },
    { name: 'Physics Fundamentals', completed: 20, paymentStatus: 'Due' }
  ];

  availableCourses = [
    { name: 'Math Foundation', price: 499 },
    { name: 'English Grammar', price: 399 }
  ];

  upcomingClasses = [
    { course: 'Biology 101', title: 'Photosynthesis', date: 'Aug 29, 10:00am' },
    { course: 'Physics Fundamentals', title: 'Newton\'s Laws', date: 'Aug 30, 11:00am' },
  ];

  payments = [
    { course: 'Biology 101', date: '2025-08-21', amount: 699, status: 'Paid' },
    { course: 'Physics Fundamentals', date: '2025-08-10', amount: 599, status: 'Pending' }
  ];

  sidebarOpen = false;

  ngOnInit() {}
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
