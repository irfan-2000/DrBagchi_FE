import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuizserviceService {

private baseurl = environment.baseUrl;
private admin_url = environment.admin_baseurl
 
 constructor(private http:HttpClient ,private router:Router)
   { }


getQuizByStatus(status:any)
{
  const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
 
  let params = new HttpParams().set('Flag',status.toString());


  return this.http.get<any>(`${this.baseurl}api/GetALLQuizByStatus?_=${unique}`,
     {
      params:params,
    headers,withCredentials: false
  });
}

startQuiz(quizId: any,courseId :any)
{
const token = localStorage.getItem('token'); // Or wherever you store your token
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
}); 
const unique = Math.random();

let params = new HttpParams().set('QuizId',quizId.toString()).set('CourseId',courseId.toString());

return this.http.post<any>(`${this.baseurl}api/startquiz?_=${unique}`,null,
 {
  params:params,
headers,withCredentials: false
 });
}


syncQuizTime(sessionid:any,quizid:any)
{
const token = localStorage.getItem('token'); // Or wherever you store your token
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
}); 
const unique = Math.random();

let params = new HttpParams().set('SessionId',sessionid.toString()).set('QuizId',quizid.toString());

return this.http.post<any>(`${this.baseurl}api/UpdatequizProgress?_=${unique}`,null,
 {
  params:params,
headers,withCredentials: false
 });
}


GetQuizData(  quizId:any,sessionId:any)
{
  const token = localStorage.getItem('token'); // Or wherever you store your token
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
}); 
const unique = Math.random();

let params = new HttpParams().set('quizId',quizId.toString()).set('sessionId',sessionId.toString());

return this.http.post<any>(`${this.baseurl}api/GetQuizData?_=${unique}`,null,
 {
  params:params,
headers,withCredentials: false
 });


}

}
     
