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
  
}
