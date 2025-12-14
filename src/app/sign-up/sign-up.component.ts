import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSignUpService } from '../login-sign-up.service';
import { response } from 'express';
 import { ToastrService } from 'ngx-toastr';
import { debug } from 'console';

 @Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
 
 
signupForm: FormGroup;
  errorMessages: any = {}; // For per-field error messages

  availableClasses:any[] = [];
   availableBatches: any[] = [];  
  availableBoards:any[] = [];
 availableSubjects:any[] = [];
UploadFile:any
 profileImagePreview:any
 OldselectedFile:any
 IsEditing:boolean = false;
 castes: string[] = [
  'SC',
  'ST',
  'State OBC',
  'Central OBC',
  'UR',
  'EWS',
  'PWD'
];



states: string[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry'
];

  constructor(private fb: FormBuilder,private toastr: ToastrService,  private loginsignupservice: LoginSignUpService,  private router: Router  ) 
  {
    this.getAvailableBoards();
    this.getAvailableClasses();
    this.getAvailableSubjects();
    this.SendOTP();
     // Set default values in constructor
    this.signupForm = this.fb.group({
      fullName: ['John Doe', Validators.required],
      email: ['johndoe@email.com', [Validators.required, Validators.email]],
      mobile: ['9999999999', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      gender: ['M', Validators.required],
      dob: ['', Validators.required],
      caste:['',Validators.required],
      parentName: ['Parent Name', Validators.required],
      parentMobile: ['8888888888', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['Default Street', Validators.required],
      city: ['Agartala', Validators.required],
      state: ['Tripura', Validators.required],
      pincode: ['799001', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      institution: ['Bagchi Institute', Validators.required],
      board: ['1', Validators.required],
      class: ['7', Validators.required],
      subject: ['', Validators.required],
      batch: ['', Validators.required],
      password: ['123', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['123', Validators.required],
      terms: [true, Validators.requiredTrue],
      profileImage: new FormControl(null, Validators.required)
    });
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

   onFileChange(event: any)
    {
    this.UploadFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => 
        {
        this.profileImagePreview = e.target.result; 
       };
      reader.readAsDataURL(file);
    }
   }




  /** Converts camelCase to readable label text **/
  private toLabel(field: string): string {
    return field.replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  /** SUBMIT HANDLER **/
  onSubmitClick(): void 
  {
    // const code = this.ValidateFormFields();
    // if (code === 0) {
    //   try {
    //     this.signupService.registerStudent(this.signupForm.value).subscribe({
    //       next: (response: any) => {
    //         if (response.status === 200) {
    //           alert('Signup Successful!');
    //           this.router.navigate(['/login']);
    //         }
    //       },
    //       error: (error: any) => {
    //         if (error.status === 401) {
    //           this.router.navigate(['/login']);
    //         } else {
    //           console.error('Error saving student:', error);
    //         }
    //       }
    //     });
    //   } catch (error: any) {
    //     console.error('Exception:', error);
    //   }
    // }
  } 
 

  getAvailableBoards()
  {
    try {
        this. loginsignupservice.getAvailableBoards( ).subscribe({
          next: (response: any) =>
             {
              this.availableBoards =response.result
              console.log(response);         
          },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

    }
    
   getAvailableClasses()
  {
    try {
        this. loginsignupservice.getAvailableClasses( ).subscribe({
          next: (response: any) =>
             {
              this.availableClasses =response.result
              console.log(response);         
          },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

    }   
        
   getAvailableSubjects(event:any = '')
  { 
   
    try {
        this. loginsignupservice.getAvailableSubjects('').subscribe({
          next: (response: any) =>
             {
              this.availableSubjects =response.result
              console.log(response);         
              this.getAvailableBatches();
          },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

    }   


  getAvailableBatches( )
  {
      
    // let ClassId = (event.target.value);
    // if(ClassId == '' || ClassId == null || ClassId == undefined)
    // {
    //   return;
    // }
 
    if(this.signupForm.get('class')?.value == '' || this.signupForm.get('class')?.value == null || this.signupForm.get('class')?.value == undefined )
    {
      return;

    }else
         if(this.signupForm.get('subject')?.value == '' || this.signupForm.get('subject')?.value == null || this.signupForm.get('subject')?.value == undefined )

    {
      return;
    }else 
      if(this.signupForm.get('board')?.value == '' || this.signupForm.get('board')?.value == null || this.signupForm.get('board')?.value == undefined )
    {
        return;
    }



    try {
        this. loginsignupservice.getAvailableBatches(this.signupForm.get('class')?.value,this.signupForm.get('subject')?.value,this.signupForm.get('board')?.value  ).subscribe({
          next: (response: any) =>
             {
              this.availableBatches =response.result
              console.log(response);         
          },
          error: (error: any) => {             
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

    }  
 
SubmitSignUp() 
{
    this.errorMessages['form'] = '';
  const validationResult = this.ValidateFormFields();
  if (validationResult === 1) 
 {  
  this.errorMessages['form'] = "Please correct the errors in the form before submitting.";
    return;
   }

  const formData = new FormData();
  formData.append('fullName', this.signupForm.get('fullName')?.value);
  formData.append('email', this.signupForm.get('email')?.value);
  formData.append('mobile', this.signupForm.get('mobile')?.value);
  formData.append('gender', this.signupForm.get('gender')?.value);
  formData.append('dob', this.signupForm.get('dob')?.value);
  formData.append('parentName', this.signupForm.get('parentName')?.value);
  formData.append('parentMobile', this.signupForm.get('parentMobile')?.value);
  formData.append('address', this.signupForm.get('address')?.value);
  formData.append('city', this.signupForm.get('city')?.value);
  formData.append('state', this.signupForm.get('state')?.value);
  formData.append('pincode', this.signupForm.get('pincode')?.value);
  formData.append('institution', this.signupForm.get('institution')?.value);
  formData.append('board', this.signupForm.get('board')?.value);
  formData.append('class', this.signupForm.get('class')?.value);
  formData.append('subject', this.signupForm.get('subject')?.value);
  formData.append('batch', this.signupForm.get('batch')?.value);
  formData.append('password', this.signupForm.get('password')?.value);
  formData.append('confirmPassword', this.signupForm.get('confirmPassword')?.value);
  formData.append('terms', this.signupForm.get('terms')?.value);
  formData.append('IsEditing',this.IsEditing.toString());
  formData.append('caste',this.signupForm.get('caste')?.value);

  
   if (this.IsEditing) 
    {
  if (this.UploadFile instanceof File)
     {
    formData.append('profileImage', this.UploadFile);
    debugger  // new file
  } else {
    formData.append('oldProfileImage', this.OldselectedFile); // add matching param in backend
  }
} else {
  formData.append('profileImage', this.UploadFile);  // keep key lowercase
}


try
{

this.loginsignupservice.SubmitSignUp(formData).subscribe({
next:(response:any)=>
{
  debugger
   if (response.status == 200) 
    {
      if(response.result> 0)
      {
        localStorage.setItem('signupsuccess','1');
        localStorage.setItem('registeredemail',this.signupForm.get('email')?.value);
        localStorage.setItem('registeredmobile',this.signupForm.get('mobile')?.value);
        localStorage.setItem('registeredname',this.signupForm.get('fullName')?.value);
        localStorage.setItem('studentid',response.result);   
        
        this.router.navigate(
          ['/OTP'],
          {
            queryParams: {              
              purpose: 'SIGNUP'   // or RESET_PASSWORD
            }
          }
        ); 
      
      }


      }
        else {
          this.errorMessages['form'] =response.message;
      }             


},error:(error:any) =>{

}})


}catch(error)
{
  console.log(error);
} 
}

SendOTP()
{
  
   this.loginsignupservice  .SendOTP('this.mobile', 'this.purpose', '' )  .subscribe({
    next: (response: any) => {
      console.log('OTP Verification Response:', response);

      if (response.status === 200) 
        {
        // ✅ OTP verified successfully
        // do next step (navigate / emit / close modal)
      } else {
        // ❌ OTP failed
       }
    },
    error: (error: any) => {
      console.error('OTP verification error:', error);
     }
  });

}


    




verifyEmail(email: string): boolean {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

 verifyMobile(mobile: string): boolean {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
}

ValidateFormFields(): number {
  let form = this.signupForm;
  this.errorMessages = {}; // reset previous errors
  let hasError = 0;

  // Full Name
  if (form.get('fullName')?.value === '' || form.get('fullName')?.value === null || form.get('fullName')?.value === undefined) {
    this.errorMessages['fullName'] = "Full Name is Required";
    hasError = 1;
  }

  // Email
  if (form.get('email')?.value === '' || form.get('email')?.value === null || form.get('email')?.value === undefined) {
    this.errorMessages['email'] = "Email is Required";
    hasError = 1;
  } else if (!this.verifyEmail(form.get('email')?.value)) {
    this.errorMessages['email'] = "Invalid email format";
    hasError = 1;
  }

  // Mobile
  if (form.get('mobile')?.value === '' || form.get('mobile')?.value === null || form.get('mobile')?.value === undefined) {
    this.errorMessages['mobile'] = "Mobile is Required";
    hasError = 1;
  } else if (!this.verifyMobile(form.get('mobile')?.value)) {
    this.errorMessages['mobile'] = "Invalid mobile number";
    hasError = 1;
  }

  // Gender
  if (form.get('gender')?.value === '' || form.get('gender')?.value === null || form.get('gender')?.value === undefined) {
    this.errorMessages['gender'] = "Gender is Required";
    hasError = 1;
  }

  // Date of Birth
  if (form.get('dob')?.value === '' || form.get('dob')?.value === null || form.get('dob')?.value === undefined) {
    this.errorMessages['dob'] = "Date of Birth is Required";
    hasError = 1;
  }


    if (form.get('caste')?.value === '' || form.get('caste')?.value === null || form.get('caste')?.value === undefined) {
    this.errorMessages['caste'] = "caste is Required";
    hasError = 1;
  }

  // Parent Name
  if (form.get('parentName')?.value === '' || form.get('parentName')?.value === null || form.get('parentName')?.value === undefined) {
    this.errorMessages['parentName'] = "Parent Name is Required";
    hasError = 1;
  }

  // Parent Mobile
  if (form.get('parentMobile')?.value === '' || form.get('parentMobile')?.value === null || form.get('parentMobile')?.value === undefined) {
    this.errorMessages['parentMobile'] = "Parent Mobile is Required";
    hasError = 1;
  } else if (!this.verifyMobile(form.get('parentMobile')?.value)) {
    this.errorMessages['parentMobile'] = "Invalid parent mobile number";
    hasError = 1;
  }

 if (!this.signupForm.get('profileImage')?.valid && !this.IsEditing ) {
      this.errorMessages['profileImage'] = 'Profile Image is required!';
      hasError = 1;
    }


  // Address
  if (form.get('address')?.value === '' || form.get('address')?.value === null || form.get('address')?.value === undefined) {
    this.errorMessages['address'] = "Address is Required";
    hasError = 1;
  }

  // City
  if (form.get('city')?.value === '' || form.get('city')?.value === null || form.get('city')?.value === undefined) {
    this.errorMessages['city'] = "City is Required";
    hasError = 1;
  }

  // State
  if (form.get('state')?.value === '' || form.get('state')?.value === null || form.get('state')?.value === undefined) {
    this.errorMessages['state'] = "State is Required";
    hasError = 1;
  }

  // Pincode
  if (form.get('pincode')?.value === '' || form.get('pincode')?.value === null || form.get('pincode')?.value === undefined) {
    this.errorMessages['pincode'] = "Pincode is Required";
    hasError = 1;
  }

  // Institution
  if (form.get('institution')?.value === '' || form.get('institution')?.value === null || form.get('institution')?.value === undefined) {
    this.errorMessages['institution'] = "Institution is Required";
    hasError = 1;
  }

  // Board
  if (form.get('board')?.value === '' || form.get('board')?.value === null || form.get('board')?.value === undefined) {
    this.errorMessages['board'] = "Board is Required";
    hasError = 1;
  }

  // Class
  if (form.get('class')?.value === '' || form.get('class')?.value === null || form.get('class')?.value === undefined) {
    this.errorMessages['class'] = "Class is Required";
    hasError = 1;
  }

  // Subject
  if (form.get('subject')?.value === '' || form.get('subject')?.value === null || form.get('subject')?.value === undefined) {
    this.errorMessages['subject'] = "Subject is Required";
    hasError = 1;
  }

  // Batch
  // if (form.get('batch')?.value === '' || form.get('batch')?.value === null || form.get('batch')?.value === undefined) {
  //   this.errorMessages['batch'] = "Batch is Required";
  //   hasError = 1;
  // }

  // Password
  if (form.get('password')?.value === '' || form.get('password')?.value === null || form.get('password')?.value === undefined) {
    this.errorMessages['password'] = "Password is Required";
    hasError = 1;
  }

  // Confirm Password
  if (form.get('confirmPassword')?.value === '' || form.get('confirmPassword')?.value === null || form.get('confirmPassword')?.value === undefined) {
    this.errorMessages['confirmPassword'] = "Confirm Password is Required";
    hasError = 1;
  } else if (form.get('password')?.value !== form.get('confirmPassword')?.value) {
    this.errorMessages['confirmPassword'] = "Password and Confirm Password must match";
    hasError = 1;
  }



  // Terms
  if (!form.get('terms')?.value) {
    this.errorMessages['terms'] = "You must accept the terms";
    hasError = 1;
  }

  return hasError;
}








  }




 
