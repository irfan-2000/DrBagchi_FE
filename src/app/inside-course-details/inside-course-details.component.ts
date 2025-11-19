import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../courses.service';
@Component({
  selector: 'app-inside-course-details',
  standalone: false,
  templateUrl: './inside-course-details.component.html',
  styleUrl: './inside-course-details.component.css'
})
export class InsideCourseDetailsComponent {
  
  // Pricing state
  isLoading:boolean = false;
  totals: any = { basePrice: 0, discount: 0, finalPrice: 0 };
  couponCode = '';
  couponValid = false;
  couponMessage = '';
  paymentMessage = '';
  selectedPaymentOption:any = ''
  discountedPrice:any
  isCouponApplying:any
  // UI state for accordion: map "ci-li" -> boolean
  openMap = new Map<string, boolean>();


  CourseId:any = [];
  Course:any = [];

  constructor(private route: ActivatedRoute, private router: Router,private Courses:CoursesService)
   {
    this.couponCode = 'summer special'
 this.route.queryParams.subscribe(params => {
     this.CourseId = params['id']; 
  }); 
 
 
  if(this.CourseId)
  {
    this.getCourseById(this.CourseId);
    this.getPricing();
  }

}

  ngOnInit(): void 
  {
    
    // Load mock data for demo; replace with API call later
   }
 
  // Apply coupon logic (simple demo)
  applyCoupon() 
  {
    this.isLoading = true;
    const code = (this.couponCode || '').trim().toUpperCase();
    const base = this.totals.basePrice;

    let discount = 0;
    if (code === 'FLAT100')
       {
      discount = 100;
    } else if (code === 'SAVE10') {
      discount = Math.round(base * 0.1);
    } else if (code === 'SAVE20') {
      discount = Math.round(base * 0.2);
    } else {
      this.couponValid = false;
      this.couponMessage = 'Invalid coupon code.';
      this.totals = { ...this.totals, discount: 0, finalPrice: base };
      return;
    }

    // clamp discount
    discount = Math.max(0, Math.min(discount, base));
    const finalPrice = base - discount;

    this.couponValid = true;
    this.couponMessage = `Coupon applied. You saved ₹${discount}.`;
    this.totals = { basePrice: base, discount, finalPrice };
  }

   

  // Mock data for demo
  getMockCourseById(id: string | null): any {
    const courses: any[] = [
      {
        id: 'chem-101',
        title: 'Chemistry 101: Foundations',
        instructor: 'Dr. A. Bose',
        imageUrl: 'https://images.unsplash.com/photo-1559757175-08eecf7b5d32?q=80&w=1200&auto=format',
        category: 'Science',
        level: 'Beginner',
        duration: '10h 20m',
        rating: 4.7,
        ratingsCount: 1289,
        price: 1499,
        longDescription:
          'Master the core concepts of atoms, molecules, bonding, and reactions with simple labs and problem sets.',
        chapters:
         [
          {
            title: 'Atoms & Molecules',
            estimated: '2h 30m',
            lessons: [
              { title: 'Atomic Structure', topics: ['Protons, Neutrons, Electrons', 'Isotopes', 'Electron shells'] },
              { title: 'Molecular Bonds', topics: ['Ionic vs Covalent', 'Polarity', 'Intermolecular Forces'] }
            ]
          },
          {
            title: 'Chemical Reactions',
            estimated: '3h 10m',
            lessons: [
              { title: 'Reaction Types', topics: ['Synthesis', 'Decomposition', 'Single/Double Replacement'] },
              { title: 'Balancing Equations', topics: ['Stoichiometry basics', 'Law of conservation of mass'] }
            ]
          }
        ]
      },
      {
        id: 'algebra-pro',
        title: 'Algebra Pro: From Linear to Quadratic',
        instructor: 'Ms. T. Gupta',
        imageUrl: 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1200&auto=format',
        category: 'Math',
        level: 'Beginner',
        duration: '12h 45m',
        rating: 4.5,
        ratingsCount: 2104,
        price: 999,
        longDescription:
          'Build algebra mastery with step-by-step methods, visual intuition, and real exam questions.',
        chapters: [
          {
            title: 'Linear Equations',
            estimated: '2h 00m',
            lessons: [
              { title: 'Solving Basics', topics: ['One-variable equations', 'Balancing operations'] },
              { title: 'Word Problems', topics: ['Rate-time-distance', 'Mixtures'] }
            ]
          },
          {
            title: 'Quadratics',
            estimated: '3h 20m',
            lessons: [
              { title: 'Factoring', topics: ['Common factor', 'Trinomials'] },
              { title: 'Formula & Graphs', topics: ['Quadratic formula', 'Vertex form', 'Parabola properties'] }
            ]
          }
        ]
      }
    ];

    return courses.find(c => c.id === id) || courses;
  }

    parsedDescription :any = [];


  getCourseById(id: any) {
  try {
    this.Courses.GetCourseById_admin(id).subscribe({
      next: (response: any) => {
        if (!response) {
          console.warn('Empty response received');
          return;
        }

        // Extract both parts
        const item1 = response.Item1 || {};
        const item2 = response.Item2 || {};

        // Merge key fields from Item2 into Item1 if missing
        this.Course = {
          ...item1,
          ShortDescription: item2.ShortDescription || item1.ShortDescription || '',
          Overview: item2.Overview   || '',
          Duration: item2.Duration || '',
          Level: item2.Level || item1.CourseLevel || '',
          Highlights: item2.Highlights || item1.Highlights || [],
          Requirements: item1.Requirements || [],
          Objectives: item1.Objectives || [],
          Batches: item1.Batches || [],
          Installments: item1.Installments || [],
        };
 
        // Optional: Store separately if needed
        this.parsedDescription = item2;

        console.log('Parsed Course:', this.Course);
        console.log(this.Course?.Highlights);
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}




Pricing:any = [];
getPricing() 
{
  debugger
  if (!this.CourseId) {
    alert("Internal Server Error");
    return;
  }

  let obj: any = {
    CourseId: this.CourseId
  };

   if (this.couponCode && this.couponCode.trim() !== "")
     {
    obj.CouponCode = this.couponCode;
  }else{
     obj.CouponCode = '';
  }

  try {
    this.Courses.getPricing(obj).subscribe({
      next: (response: any) => 
        {
          this.Pricing = response.result;
        // ✅ Handle success response
        console.log("Pricing response:", response);
      
      },
      error: (error: any) => {
        console.error("Error fetching pricing:", error);
      }
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
  }
}

  safeParse(value: any, defaultValue: any) {
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}


payNow(option: any) 
{
      this.paymentMessage = `Proceeding to payment for ₹${this.totals.finalPrice}. (Demo)`;

  if (option === 'full') {
    // Process full payment of discountedPrice or Course.Price
  } else {
    // Find installment by number and process that amount payment
    const installment = this.Course.Installments.find((inst:any)=> inst.InstallmentNumber === option);
    if (installment) {
      // Process amount: installment.Amount (apply discounts if any)
    }
  }
}


course = {
    title: "Physics Foundation",
    chapters: [
      {
        title: "Chapter 1: Motion & Measurements",
        lessons: [
          {
            title: "Understanding Motion",
            topics: [
              "Definition of motion",
              "Types of motion",
              "Speed & velocity basics"
            ]
          },
          {
            title: "Units & Measurements",
            topics: [
              "Standard units",
              "Measurement tools",
              "Accuracy & precision"
            ]
          }
        ]
      },
      {
        title: "Chapter 2: Force & Pressure",
        lessons: [
          {
            title: "Introduction to Force",
            topics: [
              "Balanced & unbalanced forces",
              "Resultant force",
              "Newton’s laws overview"
            ]
          }
        ]
      }
    ]
  };

    openLessons: any = {};

  toggleLesson(ci: number, li: number) {
    const key = `${ci}-${li}`;
    this.openLessons[key] = !this.openLessons[key];
  }

  isLessonOpen(ci: number, li: number) {
    return !!this.openLessons[`${ci}-${li}`];
  }
  
courseModules = [
  {
    moduleNo: 1,
    moduleName: "Diversity in the Living World",
    topics: "The Living World|Biological Classification|Plant Kingdom|Animal Kingdom",
    lessons: 12,
    hours: 18,
    outcomes: "Ability to classify organisms, understand biodiversity",
    includes: "Notes + PYQs + MCQs",
    open: false
  },
  {
    moduleNo: 2,
    moduleName: "Structural Organisation in Plants & Animals",
    topics: "Morphology of Flowering Plants|Anatomy|Structural Organisation in Animals",
    lessons: 10,
    hours: 19,
    outcomes: "Understanding plant & animal structures",
    includes: "Notes + Diagrams + MCQs",
    open: false
  }
];


  toggleModule(i: number) {
  this.courseModules[i].open = !this.courseModules[i].open;
}


}
