import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginSignUpService } from '../login-sign-up.service';
import { error } from 'console';

@Component({
  selector: 'app-otp',
  standalone: false,
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OTPComponent {

  mobile: string = '';
  purpose: string = '';

  otpDigits: any = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,private loginsignupservice:LoginSignUpService
  ) {}

  ngOnInit(): void 
  {
    // Receive params from URL
    this.route.queryParams.subscribe(params =>
       {
       this.purpose = params['purpose'];        
    });
  }

  /* ================= OTP INPUT ================= */

  onInput(event: any, index: number) 
  {
    const value = event.target.value;

    if (!/^[0-9]$/.test(value)) {
      event.target.value = '';
      return;
    }

    this.otpDigits[index] = value;

    if (index < 5) 
      {
      event.target.nextElementSibling?.focus();
    }
  }

onBackspace(event: KeyboardEvent, index: number) {
  const input = event.target as HTMLInputElement;

  if (event.key === 'Backspace') {
    if (input.value === '' && index > 0) {
      const prev = input.previousElementSibling as HTMLInputElement | null;
      prev?.focus();
    } else {
      // clear current digit
      this.otpDigits[index] = '';
    }
  }
}

 
  /* ================= VERIFY OTP ================= */

  verifyOtp() 
  {
    const otp = this.otpDigits ;

    if (otp.length !== 6) {
      this.errorMessage = 'Please enter the 6-digit OTP';
      return;
    }

    // 🔗 Call your backend here
    // verifyOtp(mobile, purpose, otp)

    console.log('Verify OTP:', {
      mobile: this.mobile,
      purpose: this.purpose,
      otp: otp
    });
    this.mobile = localStorage.getItem('registeredmobile') || '';

   this.loginsignupservice .submitOTP(this.mobile, this.purpose, otp)  .subscribe({
    next: (response: any) => {
 
      if (response.status == 200) 
        {debugger
          if(Number(response.result.Status)> 0)
          { 
            const el = document.getElementById('verified');
            if (el) {
              el.classList.remove('hidden');
            }
            setTimeout(() => {
             
            if (this.purpose === 'SIGNUP')
               {
              this.router.navigate(['/login']);
            }
            }, 3000);

            if(this.purpose == 'LOGIN')
            {
           this.router.navigate(['/app/dashboard']);

            }



          }else{
            this.errorMessage = response.result.Message || 'Invalid OTP';
            return;
          }
        // ✅ OTP verified successfully
        // do next step (navigate / emit / close modal)
      } else 
        {
        // ❌ OTP failed
        this.errorMessage = response.result.Message || 'Invalid OTP';
      }
    },
    error: (error: any) => {
      console.error('OTP verification error:', error);
      this.errorMessage = 'Something went wrong. Please try again.';
    }
  });




    // // Example success redirect
    // if (this.purpose === 'SIGNUP') {
    //   this.router.navigate(['/login']);
    // } else if (this.purpose === 'RESET_PASSWORD') {
    //   this.router.navigate(['/reset-password']);
    // }
  }


  
SendOTP()
{
  
   this.loginsignupservice.SendOTP(localStorage.getItem('registeredmobile'), 'this.purpose', '' )  .subscribe({
    next: (response: any) => {
      console.log('OTP Verification Response:', response);

      if (response.status === 200) 
        {
           if(Number(response.result.Status)> 0)
           {                   
             let el = document.getElementById('OTPResent');
            if (el)
               {
              el.classList.remove('hidden');
             }
            
              setTimeout(() => {  
                if (el)
               {
              el.classList.add('hidden');  
             }            
            }, 3000);

            
           }else{
                this.errorMessage = response.result.Message;
            return;
           }
        // ✅ OTP verified successfully
        // do next step (navigate / emit / close modal)
      } else {
        this.errorMessage = response.result.Message;
            return;
       }
    },
    error: (error: any) => {
      console.error('OTP verification error:', error);
     }
  });

}


}
