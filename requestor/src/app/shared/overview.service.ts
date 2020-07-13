import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  constructor(private http: HttpClient) {}

  getOdataPastRequests() {
    return this.http.get('http://localhost:3000/odataPastRequests');
  }

  getPastRequests() {
    return this.http.get('http://localhost:3000/pastRequests');
  }
}
