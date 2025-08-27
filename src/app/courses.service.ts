import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
private baseurl = environment.baseUrl;
  
 
 constructor(private http:HttpClient ,private router:Router)
   { }




  getAllCourses()
  {
    const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetAllCourses?_=${unique}`, {
    headers,withCredentials: false
  });
  
  }




   GetCourseById(CourseId:any)
  {

  let params = new HttpParams().set('CourseId',CourseId);

    const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetCourseById?_=${unique}`, {
    params,
    headers,
    withCredentials: false
  });
  
  }



}
