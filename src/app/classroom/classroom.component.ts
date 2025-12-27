import { Component, CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyCoursesService } from '../my-courses.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-classroom',
  standalone: false,
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css',
 })
export class ClassroomComponent {
  courseId: any | null = 1;
  courseName: string = "Sample Course"; // Can be replaced with API data
  sessions: any = [];
  client: any;

  MeetingId: any = null;
  Issuccess: any;
  meetingDetails: any;
  islive: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private ngZone: NgZone ,private mycourses:MyCoursesService
  ) {}
 
  async ngOnInit() 
  {
    
    // Load Zoom Client SDK dynamically
    debugger
    if (typeof window !== 'undefined') {
      const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
      this.client = ZoomMtgEmbedded.createClient();
    }

    // Read query params
    this.route.queryParams.subscribe(async params => {
      this.MeetingId = params['meetingid'];
      this.courseId = params['courseId'];
      this.Issuccess = params["zoom"];

      if (this.Issuccess === 'success' && this.MeetingId) {
        // Fetch meeting details from backend
        const response = await firstValueFrom(this.mycourses.GetOngoingClass(this.MeetingId));
        this.meetingDetails = response.result[0];
         const signatureResponse = await firstValueFrom(this.mycourses.getClientSignature(this.MeetingId));
         debugger
        this.meetingDetails.Signature = signatureResponse.result;
        if (this.meetingDetails)
           { 
          this.joinMeeting();
        }
      }
    });
  }


    // Join meeting using Zoom Client View
  async joinMeeting() 
  {
    if (!this.client) return;
    this.islive = true;

    const meetingSDKElement = document.getElementById("meetingSDKElement");
    if (!meetingSDKElement) {
      console.error("❌ meetingSDKElement not found in DOM");``
      return;
    }
 

    this.ngZone.runOutsideAngular(async () => {
      try {
        // 1️⃣ Initialize SDK
        await this.client.init({
          zoomAppRoot: meetingSDKElement,
          language: "en-US",
          patchJsMedia: true
        });
 
        // 2️⃣ Join the meeting
        await this.client.join({
          signature: this.meetingDetails.Signature, // Host signature
          meetingNumber: this.MeetingId,
          password: this.meetingDetails.zoomPassword,
          userName: this.meetingDetails.name,
         // zak: this.meetingDetails.ZakToken // Host ZAK token
        });
 
       // this.startWhiteboard();
        console.log("✅ Successfully joined meeting!");
      } catch (err) {
        console.error("❌ Zoom init/join failed", err);
      }
    });
  }


  // Fetch meeting details from backend
  async GetMeetingDetails(meetingid: any) {
    this.mycourses.GetOngoingClass(meetingid).subscribe({
      next: (response: any) => {
        this.meetingDetails = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

async getclientsignature(meetingNumber:any,role:any)
{
  this.mycourses.getClientSignature(meetingNumber).subscribe({
    next: (response: any) => 
      {
        debugger
      },error: (error: any) => {
      console.error('Error fetching signature:', error);
      return null;
    }

});
}

activeSessions: any = {};
setupParticipantEvents() {
 // Store active sessions mapped by studentId or username

 
  if (!this.client) return;

  this.client.on('participant-add', (user: any) => {
    console.log("👤 Participant joined:", user);

    // ------- IDENTIFY REAL STUDENT -------
    // You can use user.userName OR mapping based on backend
    const realStudentId = user.userName;  
    // Example: if your username looks like "student_45", parse integer

    if (!this.activeSessions[realStudentId]) {
      this.activeSessions[realStudentId] = [];
    }

    this.activeSessions[realStudentId].push(user);

    // ------- IF DUPLICATE SESSIONS FOUND -------
    if (this.activeSessions[realStudentId].length > 1) {

      const oldSession = this.activeSessions[realStudentId][0];
      const newSession = this.activeSessions[realStudentId][1];

      console.log("⚠️ Duplicate detected. Removing old session:", oldSession);

      try {
        this.client.expel(oldSession.userId);   // 🔥 KICK OLD GHOST USER
      } catch (e) {
        console.error("❌ Could not expel:", e);
      }

      // keep only new session
      this.activeSessions[realStudentId] = [newSession];
    }
  });

  this.client.on('participant-remove', (user: any) => {
    console.log("👤 Participant left:", user);

    const realStudentId = user.userName;

    if (this.activeSessions[realStudentId]) {
      // remove from tracking list
      this.activeSessions[realStudentId] = this.activeSessions[realStudentId]
        .filter((u: any) => u.userId !== user.userId);

      // clean empty arrays
      if (this.activeSessions[realStudentId].length === 0) {
        delete this.activeSessions[realStudentId];
      }
    }
  });
}

}



 
