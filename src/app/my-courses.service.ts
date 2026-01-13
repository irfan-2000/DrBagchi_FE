import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MyCoursesService {
private baseurl = environment.baseUrl;
private admin_url = environment.admin_baseurl
 
 constructor(private http:HttpClient ,private router:Router)
   { }
 


  GetMyCourses( )
  {  
   const token = localStorage.getItem('token'); // Or wherever you store your token
   
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }); 
    const unique = Math.random();  
    return this.http.get<any>(`${this.baseurl}api/GetMyCourses?_=${unique}`,
      {
      headers,withCredentials: false,
     });
   
  }
  

  

GetOngoingClass(meetingid:any='')
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 

  let params = {};
  if(meetingid)
  {
    params = { 'Meetingid': meetingid };
  }
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetOngoingClass?_=${unique}`,
    {
    headers,withCredentials: false,
   }); 
}


getClientSignature(meetingNumber:any)
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
let params = {
  MeetingNumber: meetingNumber,
 };

const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/getClientSignature?_=${unique}`,
    {
      params: params,
    headers,withCredentials: false,
   }); 

}
 GetStudentPayments( )
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
 
const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetStudentPayments?_=${unique}`,
    {
     headers,withCredentials: false,
   }); 

}


}
