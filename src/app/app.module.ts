import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { LayoutInsideComponent } from './layout-inside/layout-inside.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { OutsideLayoutComponent } from './layouts/outside-layout/outside-layout.component';
import { InsideLayoutComponent } from './layouts/inside-layout/inside-layout.component';
import { InsideCoursesComponent } from './inside-courses/inside-courses.component';
import { InsideCourseDetailsComponent } from './inside-course-details/inside-course-details.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { QuizComponent } from './quiz/quiz.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { OTPComponent } from './otp/otp.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { MyCoursesService } from './my-courses.service';
import { CoursesService } from './courses.service';
import { PaymentsComponent } from './payments/payments.component';
import { CommonModule } from '@angular/common';
  import { NgModel } from '@angular/forms';
import { StudentLiveClassWebrtcComponent } from './student-live-class-webrtc/student-live-class-webrtc.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignUpComponent,
    LoginComponent,
    ForgotpasswordComponent,
    HeaderComponent,
    FooterComponent,
    DashbaordComponent,
    LayoutInsideComponent,
    CoursesComponent,
    CourseDetailsComponent,
    OutsideLayoutComponent,
    InsideLayoutComponent,
    InsideCoursesComponent,
    InsideCourseDetailsComponent,
    MyCoursesComponent,
    QuizComponent,
    AssessmentComponent,
    OTPComponent,
    ClassroomComponent,
    PaymentsComponent,StudentLiveClassWebrtcComponent
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule, BrowserAnimationsModule, CommonModule,  ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
    }), // ToastrModule to show toasts
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
