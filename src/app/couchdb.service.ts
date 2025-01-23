import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CouchdbService {

  readonly baseURL ='https://192.168.57.185:5984/customer-detail';
  readonly userName ='d_couchdb';
  readonly password ='Welcome#2';

  constructor(private http: HttpClient) {}

  private headers = new HttpHeaders({
    'Authorization':'Basic '+btoa(this.userName + ':' + this.password),
    'Content-Type':'application/json'
  });

  addCustomer(data: any) {
    return this.http.post<any>(this.baseURL, data, { headers: this.headers });
  }

  getCustomers() {
    const url=`${this.baseURL}/_all_docs?include_docs=true`;
    return this.http.get<any>(url,{ headers: this.headers });
  }
  
  updateCustomer(_id: string, _rev: string, data: any) {
    const url=`${this.baseURL}/${_id}`;
    const updatedData={...data,_rev:_rev};
    return this.http.put<any>(url, updatedData, { headers: this.headers });
  }
  
  deleteCustomer(_id: string, _rev: string) {
    const url = `${this.baseURL}/${_id}?rev=${_rev}`;
    return this.http.delete<any>(url, { headers: this.headers });
  }
}
