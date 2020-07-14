import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpClient, HttpHeaders } from '@angular/common/http';

let newheaders = {
  'Content-Type': 'application/json',
  Authorization: 'Basic ' + btoa('P50002103:1q1q1q'),
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
export class FormService {
  constructor(private http: HttpClient) {}
  cancelEnable: boolean = false;
  form: FormGroup = new FormGroup({
    fromEmployee: new FormControl('', Validators.required),
    toEmployee: new FormControl('', Validators.required),
    fromDate: new FormControl('', Validators.required),
    toDate: new FormControl('', Validators.required),
    cancel: new FormControl(false),
  });

  setCancelBtn(value) {
    this.cancelEnable = value;
  }
  getCancelBtn() {
    return this.cancelEnable;
  }
  initializeFormGroup() {
    for (let key in this.form.controls) {
      if (key === 'cancel') {
        // * Do not disable
      } else {
        this.form.controls[`${key}`].enable();
      }
    }
    this.form.setValue({
      fromEmployee: '',
      toEmployee: '',
      fromDate: '',
      toDate: '',
      cancel: false,
    });
  }
  // *Uncomment this odata
  // postNewRequest(postData,csrfToken):any {
  //   newheaders['X-CSRF-Token'] = csrfToken;
  //   const httpOptions = new HttpHeaders(newheaders);
  //   console.log(postData);

  //   return this.http.post<any>('/sap/opu/odata/sap/ZAUTH_TEMP_SRV/RequesterSaveSet', postData, {headers: httpOptions});
  // }
  //* Comment this nodjs
  postNewRequest(postData) {
    return this.http.post<any>('http://localhost:3000/newRequest', postData);
  }
  // *Uncomment this odata
  // deleteRequest(deleteData,csrfToken) {
  //   newheaders['X-CSRF-Token'] = csrfToken;
  //   const httpOptions = new HttpHeaders(newheaders);
  //   console.log(deleteData);

  //   return this.http.post<any>('/sap/opu/odata/sap/ZAUTH_TEMP_SRV/RequesterSaveSet', deleteData, {headers: httpOptions});
  // }

  // *comment this
  deleteRequest(deleteData) {
    // * Call the request delete api here.
    return this.http.post<any>(
      'http://localhost:3000/deleteRequest',
      deleteData
    );
  }

  populateForm(request) {
    this.form.setValue(request);
    for (let key in this.form.controls) {
      if (key === 'cancel') {
        // * Do not disable
      } else {
        this.form.controls[`${key}`].disable();
      }
    }
  }
  // ? This is for odata uncomment this
  // getOdataColleagues() {
  //   return this.http.get("/sap/opu/odata/sap/ZAUTH_TEMP_SRV/SubOrdinatesSet?$filter eq ''",newHttpOptions);
  // }

  // ?Comment this
  getOdataColleagues() {
    return this.http.get('http://localhost:3000/odataColleagues');
  }

  // getColleagues() {
  //   return this.http.get('http://localhost:3000/colleagues');
  // }
}
