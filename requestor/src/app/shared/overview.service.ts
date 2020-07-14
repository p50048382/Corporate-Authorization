import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + btoa('P50002103:1q1q1q'),
  }),
};

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private _urlSurveyList: string =
    "/sap/opu/odata/sap/ZAUTH_TEMP_SRV/RequesterDisplaySet?$filter eq ''";

  constructor(private http: HttpClient) {}

  //? Uncomment this
  // getOdataPastRequests() {
  //   return this.http.get<any>(this._urlSurveyList,httpOptions);
  // }

  // *Comment this
  getOdataPastRequests() {
    return this.http.get('http://localhost:3000/odataPastRequests');
  }

  // getPastRequests() {
  //   return this.http.get('http://localhost:3000/pastRequests');
  // }
}
