import { Component, OnInit } from '@angular/core';
import { MyCoursesComponent } from '../my-courses/my-courses.component';
import { MyCoursesService } from '../my-courses.service';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {

Transactions:any= [];

  constructor(private mycourses: MyCoursesService) {
      console.log('Service instance:', this.mycourses);

  }

  ngOnInit(): void {
    this.GetStudentPayments();
  }

  GetStudentPayments()
  { 
    this.mycourses.GetStudentPayments().subscribe({
      next:(res:any)=>
      {
        this.Transactions = res.result
        debugger
        console.log("Payments fetched:", this.Transactions);
      },
      error:(err:any)=>
      {
        console.error("Error fetching payments:",err);
      }
    });
  }

}
