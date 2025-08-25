import { Component } from '@angular/core';

@Component({
  selector: 'app-forgotpassword',
  standalone: false,
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
step = 1; // 1 = Email step, 2 = OTP step
  submitted = false;

  email = '';
  otp = '';
  
  // Step 1: Submit Email
  onSubmitEmail(emailForm: any) {
    this.submitted = true;
    if (emailForm.valid) {
      console.log("Email submitted:", this.email);
      // TODO: Call backend API to send OTP
      this.step = 2;
      this.submitted = false;
    }
  }

  // Step 2: Submit OTP
  onSubmitOTP(otpForm: any) {
    this.submitted = true;
    if (otpForm.valid) {
      console.log("OTP submitted:", this.otp);
      alert('OTP Verified — Now navigate to Reset Password page');
    }
  }
}
