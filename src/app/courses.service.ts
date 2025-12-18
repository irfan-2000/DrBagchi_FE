import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
private baseurl = environment.baseUrl;
private admin_url = environment.admin_baseurl
 
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

getPricing(obj:any)
{
  
    const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.post<any>(`${this.baseurl}api/GetPricing?_=${unique}`,obj,{
    headers,
    withCredentials: true 
   });

}



  GetCourseById_admin(CourseId:any)
{
const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  

  let params = new HttpParams().set('id',CourseId.toString()).set('FromAdmin','0');


  return this.http.get<any>(`${this.admin_url}api/GetCoursebyId?_=${unique}`,
     {
      params:params,
    headers,withCredentials: false
  });
}
 
 

getCoursePayments(CourseId:any  )
{  
 const token = localStorage.getItem('token'); // Or wherever you store your token
 let params = new HttpParams().set('CourseId',CourseId.toString());

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetPaymentMethod?_=${unique}`,
    {
    headers,withCredentials: false,
    params:params
  });
 
}

Createorder_razorpay_NewOrder_subscription(paymentType: any, courseId: any, selectedPlan: any,batchId:any) {

  debugger
  const token = localStorage.getItem('token'); 

  let params = new HttpParams()
    .set('paymentType', paymentType.toString())
    .set('courseId', courseId.toString())
    .set('selectedPlan', selectedPlan.toString()).set('Isweb','1').set('batchId',batchId);//Isweb

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const unique = Math.random();

  return this.http.post<any>(
    `${this.baseurl}api/Createorder_razorpay_NewOrder_subscription?_=${unique}`,
    {},  // POST body (optional empty object)
    {
      headers: headers,
      params: params,
      withCredentials: false
    }
  );
}


verifyPayment(payload: any)
 {
 
  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const unique = Math.random();

  return this.http.post<any>(
    `${this.baseurl}api/verifyPayment?_=${unique}`,payload, 
    {
      headers: headers,   
      withCredentials: false
    }
  ); 
}


CheckIsSubscribed(Userid:any,CourseId:any)
{
const token = localStorage.getItem('token');

let params = new HttpParams()
  .set('courseId', CourseId.toString())
 
const headers = new HttpHeaders()
  .set('Authorization', `Bearer ${token}`);

return this.http.get<any>(
  `${this.baseurl}api/CheckIsSubscribed`,
  {
    headers,
    params,
    withCredentials: false
  }
);


}


Createorder_razorpay_NewOrder_fixed(paymentType: any, courseId: any, fixed_paymentMode: any,batchId:any,InstallmentId:any='0') {
debugger
   
  const token = localStorage.getItem('token'); 

  let params = new HttpParams()
    .set('paymentType', paymentType.toString())
    .set('courseId', courseId.toString())
    .set('selectedPlan', fixed_paymentMode.toString()).
    set('Isweb','1')
    .set('batchId',batchId)
    .set('InstallmentNo',InstallmentId);//Isweb

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const unique = Math.random();
 
  return this.http.post<any>(
    `${this.baseurl}api/Createorder_razorpay_NewOrder_fixed?_=${unique}`,
    {},  // POST body (optional empty object)
    {
      headers: headers,
      params: params,
      withCredentials: false
    }
  );
}

verifyPayment_fixed(payload: any)
 {
 
  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const unique = Math.random();

  return this.http.post<any>(
    `${this.baseurl}api/verifyPayment_fixed?_=${unique}`,payload, 
    {
      headers: headers,   
      withCredentials: false
    }
  ); 
}

//GetMyCourses

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


GetOngoingClass()
{const token = localStorage.getItem('token'); // Or wherever you store your token
 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  }); 
  const unique = Math.random();  
  return this.http.get<any>(`${this.baseurl}api/GetOngoingClass?_=${unique}`,
    {
    headers,withCredentials: false,
   });
 

}

}
