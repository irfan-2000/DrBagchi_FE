import { Component } from '@angular/core';
import { LoginSignUpService } from '../login-sign-up.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials = {
    Mobile: '',
    password: ''
  };

  constructor(private loginsignupservice: LoginSignUpService, private toastr: ToastrService, private router: Router) {

  }

  ErrorMessage = "";

  ValidateStudent() {

    if (this.credentials.Mobile == '' && this.credentials.Mobile == null && this.credentials.Mobile == 'undefined') {
      this.ErrorMessage = "Mobile is Required"
      return;
    }

    if (this.credentials.password == '' && this.credentials.password == null && this.credentials.password == 'undefined') {
      this.ErrorMessage = 'Password is Required';
      return;
    }


    localStorage.clear();
    localStorage.setItem('registeredemail', this.credentials.Mobile); //temp worng name for email 


    try {
      this.ErrorMessage = '';
      this.loginsignupservice.ValidateUser(this.credentials.Mobile, this.credentials.password).subscribe({
        next: (response: any) => {

          if (response.status == 200) {
            debugger
            if (Number(response.result.IsActive) <= 0) {
              this.router.navigate(
                ['/OTP'],
                {
                  queryParams: {
                    purpose: 'LOGIN'   // or RESET_PASSWORD
                  }
                }
              );
              return;
            }

            this.showToast('success', 'Welcome!', 'Success');
            window.localStorage.setItem("token", response.result.token);
            window.localStorage.setItem("userid", response.result.UserId);
            window.localStorage.setItem("Name", response.result.FullName);
            window.localStorage.setItem("Email", response.result.Email);
            this.router.navigate(['/app/dashboard']);
          }
          else if (response.status == 401) {
            this.ErrorMessage = 'Invalid UserId or Password'
            this.showToast('error', 'Invalid UserId or Password', 'error');

          }

        }, error: (error: any) => {

        }
      })


    } catch (error) {
      console.error(error);
    }

  }




  showToast(type: 'success' | 'error' | 'warning' | 'info', message: string, title: string) {
    switch (type) {
      case 'success':
        this.toastr.success(message, title);
        break;
      case 'error':
        this.toastr.error(message, title);
        break;
      case 'warning':
        this.toastr.warning(message, title);
        break;
      case 'info':
        this.toastr.info(message, title);
        break;
      default:
        console.error('Invalid toast type');
    }
  }





}
