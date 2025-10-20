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
    studentId: 'asdasd@email.com',
    password: '123'
  };
 
constructor(private  loginsignupservice:LoginSignUpService,private toastr: ToastrService,private router:Router )
{

}

  ErrorMessage = "";

  ValidateStudent()
   {

    if(this.credentials.studentId == '' && this.credentials.studentId == null && this.credentials.studentId == 'undefined')
    {
    this.ErrorMessage = "Id is Required"
      return;
    }

    if(this.credentials.password == '' && this.credentials.password == null && this.credentials.password == 'undefined')
    {
      this.ErrorMessage = 'Password is Required';
      return;
    }


      localStorage.clear();

    
    try
    {
    this.ErrorMessage = '';
    this.loginsignupservice.ValidateUser(this.credentials.studentId,this.credentials.password ).subscribe({
    next:(response:any)=>
    {
      
      if (response.status == 200) 
        {
          debugger
        
           this.showToast('success', 'Welcome!', 'Success');
           window.localStorage.setItem("token",response.result.token);
          this.router.navigate(['/app/dashboard']);
       }
       else if(response.status == 401)
        {
          this.ErrorMessage = 'Invalid UserId or Password'
          this.showToast('error', 'Invalid UserId or Password', 'error');

       }
            
    },error:(error:any) =>{

    }})

 
    }catch(error)
    {
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
