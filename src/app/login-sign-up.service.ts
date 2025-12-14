import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginSignUpService 
{
 private baseurl = environment.baseUrl;
  
 
 constructor(private http:HttpClient ,private router:Router)
   {



    }

getCourses( )
{

// let params = new HttpParams();
// params = params.append('flag', flag);
// params = params.append('Tab', Tab);
// params = params.append('PatientId',id);

//     const token = localStorage.getItem('token');  
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
    
//     return this.http.get<any>(`${this.baseurl}api/GetPatientsorReports`, {
//      params, headers: headers,
//       withCredentials: true
//     });

}

getAvailableBoards() 
{
  const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });


  const unique = Math.random(); // or crypto.randomUUID() if supported
  return this.http.get<any>(`${this.baseurl}api/guest/GetAvailableBoards?_=${unique}`, {
    headers,withCredentials: true
  });
}


getAvailableClasses() 
{
  
  const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const unique = Math.random(); // or crypto.randomUUID() if supported
  return this.http.get<any>(`${this.baseurl}api/guest/GetAvailableClasses?_=${unique}`, {
    headers,withCredentials: true
  });
}

getAvailableSubjects(ClassId:any)
{
   
let params = new HttpParams()
.set("ClassId",+ClassId);

   const unique = Math.random(); // or crypto.randomUUID() if supported
  return this.http.get<any>(`${this.baseurl}api/guest/GetAvailableSubjects?_=${unique}`, 
    {
      params:params,
    withCredentials: true
    }); 
}



getAvailableBatches(ClassId:any,subjectid:any,boardid:any)
{
   
let params = new HttpParams()
.set("ClassId",+ClassId).set('SubjectId',subjectid).set('BoardId',boardid);
 
   const unique = Math.random(); // or crypto.randomUUID() if supported
  return this.http.get<any>(`${this.baseurl}api/guest/GetAvailableBatches?_=${unique}`, 
    {
      params:params,
    withCredentials: true
  }); 
}


SubmitSignUp(formData:any)
{
  const unique = Math.random(); 
  return this.http.post<any>(`${this.baseurl}api/guest/SubmitSignup?_=${unique}`,formData,{
    withCredentials :true

  })
}


ValidateUser(UserId:any,Password:any)
{
let dto =
{
  UserId : UserId,
  Password:Password
}

const unique = Math.random(); 
  return this.http.post<any>(`${this.baseurl}api/guest/Authenticate?_=${unique}`,dto,{
    withCredentials :true

  })
}
submitOTP(mobile: string, purpose: string, otp: string) {


  const params = new HttpParams()
    .set('mobile', '9999999999')   // 🔹 hardcoded mobile
    .set('purpose', 'SIGNUP')      // 🔹 hardcoded purpose
    .set('otp', otp);         // 🔹 hardcoded OTP

  return this.http.post<any>(
    `${this.baseurl}api/guest/VerifyOTP`,
    null,
    {
      params: params,
      withCredentials: true
    }
  );
}

SendOTP(mobile: string, purpose: string, otp: string) 
{
  const params = new HttpParams()
    .set('mobile', '9999999999')   // 🔹 hardcoded mobile
    .set('purpose', 'SIGNUP')      // 🔹 hardcoded purpose
 
  return this.http.post<any>(
    `${this.baseurl}api/guest/SendOTP`,
    null,
    {
      params: params,
      withCredentials: true
    }
  );
  
}




}
