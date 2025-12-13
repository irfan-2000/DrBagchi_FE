import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizserviceService } from '../quizservice.service';
import { error } from 'console';

@Component({
  selector: 'app-assessment',
  standalone: false,
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})  
 
export class AssessmentComponent implements AfterViewInit {

   timer: any;
  violations: number = 0;
  quizActive: any = false;

  // Hardcoded Dummy Quiz Payload For UI
  questions: any =[]  
  userAnswers: any = {};

  quizSection: any;
  timerDisplay: any;
  violationsEl: any;
  timeLeft: string = '00:00:00';

quizId:any;
sessionId:any;
constructor(private router: Router,private quizservice:QuizserviceService, private route: ActivatedRoute) 
  {
  this.route.queryParams.subscribe(params => 
    {
    this.quizId = params['quizid'];
    this.sessionId = params['sessionid'];

     this.startServerTimer()
    console.log("Quiz ID:", this.quizId);
    console.log("Session ID:", this.sessionId);
    this.GetQuizData();

  });
   }

  ngAfterViewInit(): void
   {
    this.startQuiz();
    this.quizSection = document.getElementById('quizSection');
    
     this.violationsEl = document.getElementById('violations');

    const submitBtn = document.getElementById('submitQuizBtn');
    submitBtn?.addEventListener('click', () => this.submitQuiz(false));
  }

  selectAnswer(qid: number, ans: string) {
    this.userAnswers[qid] = ans;
  }

  async startQuiz() {
    await this.enterFullscreen();
    this.beginQuiz();
  }

  async enterFullscreen() {
    if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
  }

  beginQuiz() 
  { 
    // document.getElementById('startScreen')!.style.display = 'none';
    this.quizActive = true;
   // this.startServerTimer();
    this.setupSecurity();
  }

  serverEndTime!: Date;
serverCurrentTime!: Date;
remainingSeconds!: number;
timerInterval: any;

// // API call to validate server time
// refreshServerTime() {
//   this.quizService.getServerTime(this.attemptId).subscribe((res: any) => {
//     const now = new Date(res.serverTimeUtc).getTime();
//     const end = new Date(res.endTimeUtc).getTime();
//     this.remainingSeconds = Math.floor((end - now) / 1000);

//     if (this.remainingSeconds <= 0) {
//       clearInterval(this.timerInterval);
//       this.submitQuiz(true);
//     }
//   });
// }

 submitQuiz(autoSubmit: boolean = false, violation: boolean = false): void {
  if (!this.quizActive) return;

  // stop timers
  clearInterval(this.timerInterval);
  this.quizActive = false;

  const submittedAnswers = this.questions.map((q: any) => {
    return {
      questionId: q.QuestionId,
      questionType: q.QuestionType,

      // MCQ → string
      // MSQ → string[]
      // NUM → string
      answer:
        q.QuestionType === 'MSQ'
          ? (q.selectedAnswer || [])                     // array
          : q.selectedAnswer ?? null                     // string / number
    };
  });

  const payload = {
    quizId: this.quizId,
    sessionId: this.sessionId,
    autoSubmit: autoSubmit,
    violation: violation,
    submittedAtUTC: new Date().toISOString(),
    answers: submittedAnswers
  };

  // ✅ PRINT FINAL RESULT IN CONSOLE
  console.log('📤 Quiz Submitted Payload:', payload);
 
  this.quizservice.submitQuiz(payload).subscribe({
    next: (res: any) => {
      console.log('✅ Quiz submission success:', res);
    },
    error: (err: any) => {
      console.error('❌ Quiz submission failed:', err);
    }
  });

  // Optional message
  if (violation) {
    console.warn('🚫 Quiz auto-submitted due to violation');
  } else if (autoSubmit) {
    console.warn('⏳ Quiz auto-submitted due to time up');
  } else {
    console.log('📝 Quiz submitted manually');
  }
}


  setupSecurity() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.addViolation("Tab Switching Detected");
    });

    document.addEventListener('contextmenu', e => { e.preventDefault(); this.addViolation("Right Click Blocked"); });

    document.addEventListener('keydown', e => {
      const blocked = ['F12', 'F11', 'Escape'];
      if (blocked.includes(e.key) || (e.ctrlKey && ['c','v','x','u','i','j'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        this.addViolation("Shortcut Blocked");
      }
    });

    setInterval(() => {
      if (this.quizActive && (window.outerWidth - window.innerWidth > 120)) {
        this.addViolation("DevTools Detected");
      }
    }, 1000);
  }

  addViolation(reason: string) {
    this.violations++;
    this.violationsEl.textContent = this.violations;

    if (this.violations >= 3) this.submitQuiz(false, true);
    //else 
      //alert(`${reason} | Violation ${this.violations}/3`);
  }

  async exitFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
  }


 
  startServerTimer() 
  {
  this.quizservice.syncQuizTime(this.sessionId, this.quizId).subscribe({
    next: (res: any) =>
       {

        if(res.status != "200")
        {
        //    alert("Error:" + res.message);
          return
        }
         
      if (!res.result || !res.result.endTimeUTC || !res.result.serverTimeUTC)
     {
        console.error('Invalid server response for quiz timing');
        return;
      }

      // Parse server times
      this.serverEndTime = new Date(res.result.endTimeUTC);
      this.serverCurrentTime = new Date(res.result.serverTimeUTC);

      // Calculate initial remaining seconds
      this.remainingSeconds = Math.floor(
        (this.serverEndTime.getTime() - this.serverCurrentTime.getTime()) / 1000
      );

      console.log('Initial remaining seconds:', this.remainingSeconds);

      // Start countdown timer
      this.timerInterval = setInterval(() => {
        this.remainingSeconds--;

        const m = Math.floor(this.remainingSeconds / 60)
          .toString()
          .padStart(2, '0');
        const s = (this.remainingSeconds % 60)
          .toString()
          .padStart(2, '0');

        console.log(`Time Left: ${m}:${s}`);
        this.timerDisplay= `Time Left: ${m}:${s}`;

        if (this.remainingSeconds <= 0)
       {
          clearInterval(this.timerInterval);
          this.submitQuiz(true);
        }
      }, 1000);

      // Periodic server sync every 30s
      setInterval(() => {
        this.syncWithServer();
      }, 3000);
    },
    error: (err: any) => 
      {
      console.error('Error fetching quiz time:', err);
    }
  });
}

syncWithServer()
 {
  this.quizservice.syncQuizTime(this.sessionId, this.quizId).subscribe({
    next: (res: any) =>
      { 
      if (res.result && res.result.endTimeUTC && res.result.serverTimeUTC) {
        const newServerEndTime = new Date(res.result.endTimeUTC);
        const nowUTC = new Date(res.result.serverTimeUTC);

        const newRemaining = Math.floor(
          (newServerEndTime.getTime() - nowUTC.getTime()) / 1000
        );

        this.remainingSeconds = newRemaining;

        console.log('Synced remaining seconds:', this.remainingSeconds);

        // Auto submit if server time is over
        if (this.remainingSeconds <= 0) 
          {
          clearInterval(this.timerInterval);
          this.submitQuiz(true);
        }
      } else {
        console.error('Invalid server response during sync');
      }
    },
    error: (err: any) => {
      console.error('Error syncing with server:', err);
    }
  });
} 
  isCorrect(option: string, question: any)
   {
    
  }
showpopup:any = false;
IsExpired:any = false;
quizstatus:any;

GetQuizData()
{
  this.quizservice.GetQuizData(this.quizId,this.sessionId).subscribe(
    {
    next: (res: any) =>
       {debugger

        if(res.status != 200)
        {
          if(res.status == 410)
          {
            this.showpopup = true;
            this.quizstatus = "Quiz time has been expired. You can no longer take this quiz.";
          }
          else if(res.status == 404)
          {
             this.showpopup = true;
            this.quizstatus = "Quiz not found. Please check the quiz link or contact support.";
        
          }

        }
        else
          {
           //this.questions= res.result;
        this.questions = res.result.map((q: any) => {
        let options = [];

        if (q.OptionA) options.push({ key: 'A', text: q.OptionA });
        if (q.OptionB) options.push({ key: 'B', text: q.OptionB });
        if (q.OptionC) options.push({ key: 'C', text: q.OptionC });
        if (q.OptionD) options.push({ key: 'D', text: q.OptionD });

        return {
          ...q,
          uiOptions: options,
          selectedAnswer: q.QuestionType === 'MSQ' ? [] : ''
        };
      });

        }
       

        
       },
    error: (err: any) => 
      { 
      console.error('Error fetching quiz data:', err);
}});
}

toggleMSQ(q: any, key: string) {
  if (!q.selectedAnswer) {
    q.selectedAnswer = [];
  }

  if (q.selectedAnswer.includes(key)) {
    q.selectedAnswer = q.selectedAnswer.filter((x: string) => x !== key);
  } else {
    q.selectedAnswer.push(key);
  }
}
selectedImage: string | null = null;

openImage(img: string) {
  this.selectedImage = img;
  this.activeImage= img;
}

 // in your component
activeImage: string | null = null;
 


}
