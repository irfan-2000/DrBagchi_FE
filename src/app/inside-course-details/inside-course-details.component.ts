import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../courses.service';
import { environment } from '../environments/environment';
import { env } from 'process';

declare var Razorpay: any;
  
@Component({
  selector: 'app-inside-course-details',
  standalone: false,
  templateUrl: './inside-course-details.component.html',
  styleUrl: './inside-course-details.component.css'
})
export class InsideCourseDetailsComponent 
{
  private razorpay_key_id =  environment.razorpay_key_id;
  private razorpay_key_secret =  environment.razorpay_key_secret;
  
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
courseModules :any = [];
paymentType:any = "";
fixed_paymentMode:any = "";

selectedBatchId: number | null = null;
selectedBatch: any = null;
IsSusbcribed: any = [];
fixedpaymentplans:any=[];

constructor(private route: ActivatedRoute, private router: Router,private Courses:CoursesService)
   {
    this.couponCode = 'summer special'
 this.route.queryParams.subscribe(params => {
     this.CourseId = params['id']; 
  }); 
 
 
  if(this.CourseId)
  {
    this.getCourseById(this.CourseId);
    //this.getPricing();
    this.getCoursePayments( );
    this.CheckIsSubscribed();
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
        this.courseModules = response.Item3 || [];
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
 console.log(option)

      this.paymentMessage = `Proceeding to payment for ₹${this.totals.finalPrice}. (Demo)`;

  if (option === 'full') 
    {
    // Process full payment of discountedPrice or Course.Price
  } else {
    // Find installment by number and process that amount payment
    const installment = this.Course.Installments.find((inst:any)=> inst.InstallmentNumber === option);
    if (installment) {
      // Process amount: installment.Amount (apply discounts if any)
    }
  }
}

 
    openLessons: any = {};

  toggleLesson(ci: number, li: number) {
    const key = `${ci}-${li}`;
    this.openLessons[key] = !this.openLessons[key];
  }

  isLessonOpen(ci: number, li: number) {
    return !!this.openLessons[`${ci}-${li}`];
  }



  toggleModule(i: number) {
  this.courseModules[i].open = !this.courseModules[i].open;
}


selectedPlan:any = '';
Subscriptionplans:any =[];
getCoursePayments() 
{

  this.Courses.getCoursePayments(this.CourseId).subscribe({
    next: (response: any) => 
      {
 
      this.paymentType = response.result.PaymentType;
      if(this.paymentType === 'subscription')
      {
        this.Subscriptionplans.push({
          monthlyAmount: response.result.MonthlyAmount,
          quarterlyAmount: response.result.QuarterlyAmount,
          halfYearlyAmount: response.result.HalfYearlyAmount,
          yearlyAmount: response.result.YearlyAmount
        });
      }
      this.Subscriptionplans = this.Subscriptionplans[0];

      if (!response || !response.result) {
        console.warn("No course payment data found");
        return;
      }

      const result = response.result;
      console.log("course payment details", result);
 
      // -------------------------------------------------------------------
      // FIXED PAYMENT TYPE
      // -------------------------------------------------------------------
       debugger
      if (this.paymentType === 'fixed')
         {
          this.fixedpaymentplans = 
          {
            fixed_paymentMode: result.fixed_paymentMode || '',
            Totalprice: result.Totalprice || 0,
            NoOfInstallments: result.Installments.length || 0,
            Installments: result.Installments || []
          }         
        
      }

      // -------------------------------------------------------------------
      // SUBSCRIPTION PAYMENT TYPE
      // -------------------------------------------------------------------
      if (result.paymentType === 'subscription') {

        // this.paymentForm.patchValue({
        //   monthlyAmount: result.monthlyAmount || 0,
        //   quarterlyAmount: result.quarterlyAmount || 0,
        //   halfYearlyAmount: result.halfYearlyAmount || 0,
        //   yearlyAmount: result.yearlyAmount || 0
        // });
      }

    },
    error: (err: any) => {
      this.isLoading = false;
      alert("Error submitting course details: " + (err.error?.ErrorMessage || err.message));
    }
  });

}

 Createorder_razorpay_NewOrder_subscription()
  {

    if(this.selectedPlan === '' || this.selectedPlan === null || this.selectedPlan === undefined)
    {
      alert("Please select a subscription plan.");
      return;
    }

    if(this.selectedBatchId === null || this.selectedBatchId === undefined ||this.selectedBatchId === 0)
    {
      alert("Please select a batch.");
      return;
    }

  this.Courses.Createorder_razorpay_NewOrder_subscription(this.paymentType, this.CourseId, this.selectedPlan,this.selectedBatchId)
    .subscribe({
      next: (response: any) => {
        console.log("Razorpay Order Response:", response);

        const order = response.result;

        const options: any = {
          key:this. razorpay_key_id,  // your Razorpay Key ID
          amount: Number(order.amount) * 100, // amount in paise
          currency: order.currency,
          name: "Dr Bagchi’s Classes",
          description: "Course Subscription",
          order_id: order.orderId,
          handler: (paymentResponse: any) => {
            console.log("Payment Response:", paymentResponse);

            // Step 3: Send payment details to backend for verification
            const payload = {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              courseId: this.CourseId,
              plan: this.selectedPlan,
              amount: order.amount
            };
             

            this.Courses.verifyPayment(payload).subscribe({
              next: (vres: any) =>
                 {
                  
                console.log("Payment Verified:", vres);
                //alert("Payment successful and verified!");
                window.location.reload();
              },
              error: (err: any) => {
                console.error("Payment verification failed", err);
                alert("Payment verification failed!");
              }
            });
          },
          prefill: {
            name: '',   // optional: user name
            email: '',  // optional: user email
            contact: '' // optional: user phone
          },
          theme: { color: "#0b5ed7" }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (err: any) => {
        this.isLoading = false;
        alert("Error creating Razorpay order: " + (err.error?.ErrorMessage || err.message));
      }
    });
}




selectBatch(batch: any)
 {
   
  this.selectedBatchId = batch.batchId;
 // this.selectedBatch = batch;
  console.log("Selected Batch:", batch);
}



CheckIsSubscribed()
{
  this.Courses.CheckIsSubscribed( localStorage.getItem('userid'),this.CourseId).subscribe
  ({
    next: (response: any) =>
    {
      this.IsSusbcribed = response.result;

      if(this.IsSusbcribed.isActive == '1')
      {
        this.selectedBatchId = Number(this.IsSusbcribed.batchId);
         
      }
       console.log("Subscription Status:",   this.IsSusbcribed.isActive );
      
    },error: (err: any) => {  
      console.log("Error checking subscription status:", err);
    }
});

}



 Createorder_razorpay_NewOrder_fixed(fixed_paymentMode:any,InstallmentNumber:any = 0)
  {
 
    if(fixed_paymentMode === '' || fixed_paymentMode === null || fixed_paymentMode === undefined)
    {
      alert("Please select a subscription plan.");
      return;
    }

    if(this.selectedBatchId === null || this.selectedBatchId === undefined ||this.selectedBatchId === 0)
    {
      alert("Please select a batch.");
      return;
    }

     
  this.Courses.Createorder_razorpay_NewOrder_fixed(this.paymentType, this.CourseId, fixed_paymentMode,this.selectedBatchId,InstallmentNumber)
    .subscribe({
      next: (response: any) => {
        console.log("Razorpay Order Response:", response);

        const order = response.result;

        const options: any = {
          key:this. razorpay_key_id,  // your Razorpay Key ID
          amount: Number(order.amount) * 100, // amount in paise
          currency: order.currency,
          name: "Dr Bagchi’s Classes",
          description: "Course Subscription",
          order_id: order.orderId,
          handler: (paymentResponse: any) => {
            console.log("Payment Response:", paymentResponse);

            // Step 3: Send payment details to backend for verification
            const payload = {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              courseId: this.CourseId,
              plan: this.selectedPlan,
              amount: order.amount
            };
             

            this.Courses.verifyPayment_fixed(payload).subscribe({
              next: (vres: any) =>
                 {
                  
                console.log("Payment Verified:", vres);
                //alert("Payment successful and verified!");
                window.location.reload();
              },
              error: (err: any) => {
                console.error("Payment verification failed", err);
                alert("Payment verification failed!");
              }
            });
          },
          prefill: {
            name: '',   // optional: user name
            email: '',  // optional: user email
            contact: '' // optional: user phone
          },
          theme: { color: "#0b5ed7" }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (err: any) => {
        this.isLoading = false;
        alert("Error creating Razorpay order: " + (err.error?.ErrorMessage || err.message));
      }
    });
}

}