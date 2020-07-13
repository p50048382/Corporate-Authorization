import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  approve_reject: boolean;
  constructor(private http: HttpClient) {}

  // *Working with odata
  getOdataPendingRequests() {
    return this.http.get('http://localhost:3000/odataPendingRequests');
  }

  getPendingRequests() {
    return this.http.get('http://localhost:3000/pendingRequests');
  }

  approveRequests(requests) {
    return this.http.post('http://localhost:3000/approveRequests', requests);
  }
  rejectRequests(requests) {
    return this.http.post('http://localhost:3000/rejectRequests', requests);
  }
  setToApprove() {
    this.approve_reject = true;
  }
  setToReject() {
    this.approve_reject = false;
  }
}
