import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { response } from 'express';
import { QuizserviceService } from '../quizservice.service';

@Component({
  selector: 'app-quiz',
  standalone: false,
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {

  constructor(private router: Router,private quizservice:QuizserviceService) 
  {
    this. Getquizbystatus('UN');

  }
ongoingQuizzes1 = [
    {
      id: 1,
      title: 'Java Basics Mock Test',
      subject: 'Java',
      batch: 'Morning',
      status: 'Live',
      startTime: '2025-10-22T09:00:00+05:30',
      endTime: '2025-10-22T09:30:00+05:30',
      numberOfQuestions: 25,
      durationMinutes: 30,
      markingScheme: '+4/-1',
      instructions: [
        'Each question carries 4 marks.',
        'One mark is deducted for wrong answers.',
        'Complete within 30 minutes.'
      ]
    },
    {
      id: 2,
      title: 'OOPs Concepts Quiz',
      subject: 'Java',
      batch: 'Evening',
      status: 'Active',
      startTime: '2025-10-22T19:00:00+05:30',
      endTime: '2025-10-22T19:30:00+05:30',
      numberOfQuestions: 20,
      durationMinutes: 25,
      markingScheme: '+2/-0.5',
      instructions: [
        '20 MCQs, no negative marking.',
        'Attempt all.',
        'Auto-submit via timer.'
      ]
    }
  ];

  pastQuizzes = [
    {
      id: 3,
      title: 'Array Fundamentals',
      subject: 'Java',
      date: '2025-10-19T08:00:00+05:30',
      batch: 'Morning',
      status: 'Attended',
      score: '80%',
      link: '/quiz/3/result'
    },
    {
      id: 4,
      title: 'Constructor Theory',
      subject: 'Java',
      date: '2025-10-18T08:00:00+05:30',
      batch: 'Evening',
      status: 'Missed',
      score: '-',
      link: ''
    }
  ];

  upcomingQuizzes1 = [
    {
      id: 5,
      title: 'Inheritance Deep Dive',
      subject: 'Java',
      batch: 'Morning',
      scheduledTime: '2025-10-24T08:00:00+05:30',
      status: 'Scheduled'
    }
  ];

  // Modal controls and data
  showInstructionsModal = false;
  selectedQuiz: any = null;

  ISTString(dateStr: string)
   {
    return new Date(dateStr).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  attendQuiz(quiz: any) 
  {
     
    this.selectedQuiz = quiz;
    this.showInstructionsModal = true;
  }

  closeModal() {
    this.showInstructionsModal = false;
    this.selectedQuiz = null;
  }

  startQuiz(quizId: number,courseid:any)
  {
debugger

    this.quizservice.startQuiz(quizId,courseid).subscribe({
      next: (response: any) =>
      {
          this.closeModal();
          debugger
         const url = `/assessment-page?quizId=${encodeURIComponent(quizId)}&sessionid=${response.result.Sessionid}&quizid=${quizId}&isStarted=true`;
      // Use the native window.open() method to navigate to this relative URL in a new tab/window
        window.open(url, '_blank');
      
        console.log('Quiz started successfully:', response);
      },error: (err: any) => 
      {
        console.log("error starting quiz:", err); 
      }
 
    })


  }

Quizbystatus:any
ongoingQuizzes:any =[]
upcomingQuizzes:any =[]
Getquizbystatus(flag: any)
 {
  this.quizservice.getQuizByStatus(flag).subscribe({
    next: (response: any) =>
      {
        
        this.Quizbystatus = response.result; 
        //"StartDateTime": "06-12-2025",
        // "StartTime": "16:00:00",
   this.ongoingQuizzes = this.Quizbystatus.filter((q:any) => 
    {
  const now = new Date();
  const start = this.combineDateAndTime(q.StartDateTime, q.StartTime);
  const end = this.combineDateAndTime(q.EndDateTime, q.EndTime);
  return start <= now && end >= now; // started but not finished
});


this.upcomingQuizzes = this.Quizbystatus.filter((q:any) =>
  this.combineDateAndTime(q.StartDateTime, q.StartTime) > new Date()
);
 

       console.log(response);
    },
    error: (err: any) => {
      console.log('Error fetching quizzes by status:', err);
    }
  });
}
combineDateAndTime(dateStr: string, timeStr: string): Date 
{
  const [day, month, year] = dateStr.split('-');
  console.log("Final time "   , new Date(`${year}-${month}-${day}T${timeStr}`))
  return new Date(`${year}-${month}-${day}T${timeStr}`);
}
 
convertToAmPm(time24: string): string 
{ 
  if (!time24) return "";

  // Split hours and minutes
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minutes = minuteStr;

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // Convert 0 to 12

  return `${hour}:${minutes} ${ampm}`;
}
formatDuration(duration: string): string {
  if (!duration) return "";

  const timePart = duration.split(".")[0];  // remove milliseconds
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  let result = "";

  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (seconds > 0) result += `${seconds}s`;

  return result.trim();
}
  
// convert string time to comparable number format e.g. "16:00:00" → 160000
to24HrTime(time: string): number 
{debugger
  if (!time) return 0;
  return Number(time.replace(/:/g, ""));
}



 

}
