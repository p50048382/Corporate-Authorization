import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  postNewRequest(postData) {
    // * Call the new creating api here.
    // console.log(postData);
    return this.http.post<any>('http://localhost:3000/newRequest', postData);
  }

  // updateRequest(request) {
  //   // * Call the updating odata here.
  // }

  deleteRequest(deleteData) {
    // * Call the request delete api here.
    return this.http.post<any>(
      'http://localhost:3000/deleteRequest',
      deleteData
    );
  }

  populateForm(request) {
    // console.log(request);
    this.form.setValue(request);
    // console.log(this.form);
    for (let key in this.form.controls) {
      if (key === 'cancel') {
        // * Do not disable
      } else {
        this.form.controls[`${key}`].disable();
      }
    }
    // this.form.controls.fromEmployee.disable();
    // this.form.controls.toEmployee.disable();
    // this.form.controls.fromDate.disable();
    // this.form.controls.toDate.disable();
    // this.form.disable();
  }

  getColleagues() {
    return this.http.get('http://localhost:3000/colleagues');
  }
}
