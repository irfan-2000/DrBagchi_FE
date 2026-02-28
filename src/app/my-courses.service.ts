import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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


joinRoom(roomName: string, identity: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      roomName: roomName,
      identity: identity
    };

    return this.http.post(`${this.baseurl}api/JoinClass`,   body,     { headers }
    );
  }


 markAttendance(payload: any, token: string | null) {
  return this.http.post(
    `${this.baseurl}api/JoinClass`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

getMessages(roomName: string, pageSize: number, lastMessageId?: number) {

  return this.http.post<any[]>(
    `${this.baseurl}api/guest/GetChat`,
    {
      RoomName: roomName,
      PageSize: pageSize,
      LastMessageId: lastMessageId
    }
  );
}

    getOlderMessages(roomName: string, pageSize: number, lastMessageId: number)
      {
  
  return this.http.post<any[]>(
    `${this.baseurl}api/guest/GetChat`,
    {
      RoomName: roomName,
      PageSize: pageSize,
      LastMessageId: lastMessageId
    }
  );
  }

   sendMessage(payload: any) {
    return this.http.post<any>(
      `${this.baseurl}api/guest/SendChat`,
      payload
    );
  }


}
