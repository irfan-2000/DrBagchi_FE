import { Component } from '@angular/core';
import { LoginSignUpService } from '../login-sign-up.service';
import { error } from 'console';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: false,
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
step = 1; // 1 = Email step, 2 = OTP step
  submitted = false;

  mobile = '';
  otp = '';
  password = '';
  confirmPassword = '';
  constructor(private loginsignupservice:LoginSignUpService,private route :ActivatedRoute,  private router: Router)
  {

  }

  errorMessage:any = '';
  // Step 1: Submit Email
  onSubmitEmail(emailForm: any) 
  {
    this.submitted = true;
    if (emailForm.valid)
       {
      console.log("Email submitted:", this.mobile);
      // TODO: Call backend API to send OTP
    
    }
  }



 SendOTP()
  {
  this.loginsignupservice.CheckMobileExist(this.mobile).subscribe({
    next: (res: any) => {

      if (res.status !== 200 || res.result <= 0) {
        this.errorMessage = 'Mobile number not registered';
        return;
      }

      localStorage.setItem('registeredmobile', this.mobile);

      this.loginsignupservice.SendOTP(this.mobile,'', '').subscribe({
        next: (otpRes: any) => 
          {  
          if (otpRes.status === 200 && Number(otpRes.result.Status) > 0) {
            this.step = 2;
            this.submitted = false;
          } else {
            this.errorMessage = otpRes.result?.Message || 'Failed to send OTP';
          }
        },
        error: () => {
          this.errorMessage = 'Unable to send OTP. Please try again.';
        }
      });
    },
    error: () => {
      this.errorMessage = 'Mobile number not registered';
    }
  });
} 
    
ReSendOTP()
{
  
   this.loginsignupservice.SendOTP(localStorage.getItem('registeredmobile'), 'this.purpose', '' )  .subscribe({
    next: (response: any) => {
      console.log('OTP Verification Response:', response);

      if (response.status === 200) 
        {
           if(Number(response.result.Status)> 0)
           {              
            
            debugger
              this.step = 2;
              this.submitted = false;
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
            
           } 
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


  verifyOtp() 
  {
    this.errorMessage = '';
 
    if (this.otp.length !== 6) {
      this.errorMessage = 'Please enter the 6-digit OTP';
      return;
    } 

   this.loginsignupservice  .submitOTP(this.mobile, '', this.otp)  .subscribe({
    next: (response: any) => {
 
      if (response.status == 200) 
        {debugger
          if(Number(response.result.Status)> 0)
          { 
           this.step = 3;

          }
          else
          {
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
 
  }



submitPassword  ()
{
   if(this.password == '' || this.confirmPassword == '')
  {
    this.errorMessage = 'Please fill all the fields';
    return;
  }
   if(this.password !== this.confirmPassword)
  {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  if(this.password.length < 6)
  {
    this.errorMessage = 'Password must be at least 6 characters long';
    return;
  }

  this.loginsignupservice.ResetPassword(this.mobile, this.password).subscribe({
    next: (res: any) => 
      {
        debugger
      if (res.status === 200 && Number(res.result) > 0)
      {  const el = document.getElementById('verified');
            if (el) {
              el.classList.remove('hidden');
            }
            setTimeout(() => {
               if (el)
               {
              el.classList.add('hidden');  
             }  
                          this.router.navigate(['/login']);

            }, 3000);



      } else 
        {
        this.errorMessage = res.result?.Message || 'Failed to reset password';
      }
    },error: (error: any) => 
      {
      {

      }
    }
  });

}

}
