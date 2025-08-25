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
  return this.http.get<any>(`${this.baseurl}api/GetAvailableBoards?_=${unique}`, {
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
  return this.http.get<any>(`${this.baseurl}api/GetAvailableClasses?_=${unique}`, {
    headers,withCredentials: true
  });
}

getAvailableSubjects(ClassId:any)
{
   
let params = new HttpParams()
.set("ClassId",+ClassId);

   const unique = Math.random(); // or crypto.randomUUID() if supported
  return this.http.get<any>(`${this.baseurl}api/GetAvailableSubjects?_=${unique}`, 
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
  return this.http.get<any>(`${this.baseurl}api/GetAvailableBatches?_=${unique}`, 
    {
      params:params,
    withCredentials: true
  }); 
}


SubmitSignUp(formData:any)
{
  const unique = Math.random(); 
  return this.http.post<any>(`${this.baseurl}api/SubmitSignup?_=${unique}`,formData,{
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
  return this.http.post<any>(`${this.baseurl}api/Authenticate?_=${unique}`,dto,{
    withCredentials :true

  })
}




}
