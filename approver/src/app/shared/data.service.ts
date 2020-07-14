import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let newheaders = {
  'Content-Type': 'application/json',
  // Authorization: 'Basic ' + btoa('P50002103:1q1q1q'),
  Authorization: 'Basic ' + btoa('p55002704:rr@123'), //*This is for approver
};

const newHttpOptions = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Basic ' + btoa('P50002103:1q1q1q'))
    .set('X-CSRF-Token', 'fetch'),
  observe: 'response' as 'body',
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  approve_reject: boolean;
  constructor(private http: HttpClient) {}

  // *Working with odata
  // *Uncomment this one
  // getOdataPendingRequests() {
  //   return this.http.get("/sap/opu/odata/sap/ZAUTH_TEMP_SRV/ApproverDisplaySet?$filter eq ''",newHttpOptions);
  // }

  // approveRequests(requests,csrfToken) {
  //   newheaders['X-CSRF-Token'] = csrfToken;
  //   const httpOptions = new HttpHeaders(newheaders);
  //   return this.http.post('/sap/opu/odata/sap/ZAUTH_TEMP_SRV/ApproverSaveHdrSet', requests,{headers: httpOptions});
  //   // * How to make deep insert? Harphool has told to do deep insert
  // }
  // rejectRequests(requests,csrfToken) {
  //   newheaders['X-CSRF-Token'] = csrfToken;
  //   const httpOptions = new HttpHeaders(newheaders);
  //   return this.http.post('/sap/opu/odata/sap/ZAUTH_TEMP_SRV/ApproverSaveHdrSet', requests,{headers: httpOptions});
  // }

  // These are for nodejs data
  // getPendingRequests() {
  //   return this.http.get('http://localhost:3000/pendingRequests');
  // }

  // Pls comment this below code for odata
  getOdataPendingRequests() {
    return this.http.get('http://localhost:3000/odataPendingRequests');
  }

  approveRequests(requests) {
    return this.http.post('http://localhost:3000/approveRequests', requests);
  }
  rejectRequests(requests) {
    return this.http.post('http://localhost:3000/rejectRequests', requests);
  }
  // *Dont comment below code
  setToApprove() {
    this.approve_reject = true;
  }
  setToReject() {
    this.approve_reject = false;
  }
}
