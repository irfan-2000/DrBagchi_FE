import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  standalone: false,
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
ongoingQuizzes = [
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

  upcomingQuizzes = [
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

  ISTString(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  attendQuiz(quiz: any) {
    this.selectedQuiz = quiz;
    this.showInstructionsModal = true;
  }

  closeModal() {
    this.showInstructionsModal = false;
    this.selectedQuiz = null;
  }

  startQuiz(quizId: number) {
    alert('Starting Quiz ID: ' + quizId);
    this.closeModal();
  }

}
