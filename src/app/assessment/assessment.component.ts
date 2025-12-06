import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-assessment',
  standalone: false,
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})  
 
export class AssessmentComponent implements AfterViewInit {

  timeLeft: number = 300;
  timer: any;
  violations: number = 0;
  quizActive: any = false;

  // Hardcoded Dummy Quiz Payload For UI
  questions: any[] = [
    {
      id: 1,
      text: "Identify the structure labeled X in the diagram of a hibiscus plant.",
      image: "/uploads/qimages/hibiscus_flower.png",
      options: ["Root", "Stem", "Leaf", "Flower"],
      correct: "Flower"
    },
    {
      id: 2,
      text: "Which of the following is not a mammal?",
      image: "",
      options: ["Whale", "Bat", "Crocodile", "Dolphin"],
      correct: "Crocodile"
    },
    {
      id: 3,
      text: "Observe the two images of hibiscus and rose. Identify which flower has fused petals.",
      image: "",
      options: ["Hibiscus", "Rose", "Both", "None"],
      correct: "Hibiscus"
    },
    {
      id: 4,
      text: "The diagram shows two types of roots. Identify the taproot system.",
      image: "/uploads/qimages/taproot_vs_fibrous.png",
      options: ["Image A", "Image B", "Both", "None"],
      correct: "Image A"
    },
    {
      id: 5,
      text: "What part of the plant is mainly responsible for photosynthesis?",
      image: "/uploads/qimages/leaf_structure.png",
      options: ["Leaf", "Stem", "Flower", "Root"],
      correct: "Leaf"
    }
  ];

  userAnswers: any = {};

  quizSection: any;
  timerDisplay: any;
  violationsEl: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.quizSection = document.getElementById('quizSection');
    this.timerDisplay = document.getElementById('timerDisplay');
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
    this.startServerTimer();
    this.setupSecurity();
  }

  serverEndTime!: Date;
serverCurrentTime!: Date;
remainingSeconds!: number;
timerInterval: any;

startServerTimer(endTimeUtc: string, serverTimeUtc: string)
 {
  this.serverEndTime = new Date(endTimeUtc);
  this.serverCurrentTime = new Date(serverTimeUtc);

  // Calculate initial difference
  this.remainingSeconds = Math.floor(
    (this.serverEndTime.getTime() - this.serverCurrentTime.getTime()) / 1000
  );

  this.timerInterval = setInterval(() => {
    this.remainingSeconds--;

    const m = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const s = (this.remainingSeconds % 60).toString().padStart(2, '0');
    this.timerDisplay.textContent = `Time Left: ${m}:${s}`;

    if (this.remainingSeconds <= 0) {
      clearInterval(this.timerInterval);
      this.submitQuiz(true);
    }
  }, 1000);

  // periodic server check every 30s
  setInterval(() => {
    //this.refreshServerTime();
  }, 30000);
}

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


  submitQuiz(autoSubmit: boolean = false, violation: boolean = false) {
    if (!this.quizActive) return;
    clearInterval(this.timer);
    this.quizActive = false;

    let score = 0;
    this.questions.forEach(q => {
      if (this.userAnswers[q.id] === q.correct) score++;
    });

    let msg = `Score: ${score}/${this.questions.length}\n`;
    if (violation) msg = "Security Violation! Quiz Terminated\n\n" + msg;
    else if (autoSubmit) msg = "⏳ Time Up - Auto Submitted\n\n" + msg;

    alert(msg);
    this.exitFullscreen();
    location.reload();
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
    else alert(`${reason} | Violation ${this.violations}/3`);
  }

  async exitFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
  }


 


}
