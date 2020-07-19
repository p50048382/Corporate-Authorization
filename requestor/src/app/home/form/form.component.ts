import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { NotificationService } from 'src/app/shared/notification.service';
import { FormService } from 'src/app/shared/form.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-form',
  // templateUrl: './form.component.html',
  templateUrl: './odataForm.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  csrfToken = '';
  minFromDate: Date;
  maxFromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  colleagues: any = [];
  fromCollegues: any = [];
  toCollegues: any = [];

  constructor(
    public formService: FormService,
    public dialogRef: MatDialogRef<HomeComponent>,
    private notificationService: NotificationService
  ) {
    this.setDate();
  }

  ngOnInit(): void {
    // console.log(this.formService.form.value);

    this.getColleaguesData();
  }

  setDate() {
    this.minFromDate = new Date();
    this.maxFromDate = new Date(9999, 12, 31);
    this.minToDate = new Date();
    this.maxToDate = new Date(9999, 12, 31);
  }
  validateDate1(type: string, event: MatDatepickerInputEvent<Date>) {
    // console.log(event);
    // console.log(this.formService.form.controls);
    this.minToDate = event.value;
  }
  validateDate2(type: string, event: MatDatepickerInputEvent<Date>) {
    // console.log(event);
    this.maxFromDate = event.value;
  }

  getColleaguesData() {
    // *1. This is for odata
    this.formService.getOdataColleagues().subscribe((res) => {
      // *pls uncomment this
      // this.csrfToken = res.headers.get('X-CSRF-Token');

      let array = [];
      res['entry'].forEach((colleage) => {
        array.push(colleage['content']['properties']);
      });

      // console.log(array);
      this.colleagues = array;
      this.fromCollegues = [...this.colleagues];
      this.toCollegues = [...this.colleagues];
    });
    // *2. This is for nodejs
    // this.formService.getColleagues().subscribe((response) => {
    //   this.colleagues = response;
    //   this.fromCollegues = [...this.colleagues];
    //   this.toCollegues = [...this.colleagues];
    // });
  }
  onFromColleagueChange(fromColleageInput) {
    // *1. odata binding
    // console.log(fromColleageInput.value);
    this.toCollegues = [...this.colleagues];

    this.toCollegues.splice(
      this.toCollegues.findIndex((x) => {
        let index = x.Pernr == fromColleageInput.value;
        // console.log(index);
        return index;
      }),
      1
    );
    // console.log(this.toCollegues);
    // console.log(this.colleagues);
    // *2.Nodejs change in toCollegues drop down array
    // this.toCollegues = [...this.colleagues];
    // this.toCollegues.splice(
    //   this.toCollegues.findIndex((x) => x.eCode === fromColleageInput.value),
    //   1
    // );
  }
  onToColleagueChange(toColleageInput) {
    // *1. odata binding

    // console.log(toColleageInput);
    this.fromCollegues = [...this.colleagues];
    this.fromCollegues.splice(
      this.fromCollegues.findIndex((x) => x.Pernr == toColleageInput.value),
      1
    );

    // console.log(this.fromCollegues);
    // console.log(this.colleagues);
    // *2.nodejs change in fromCollegues drop down array
    // this.fromCollegues = [...this.colleagues];
    // this.fromCollegues.splice(
    //   this.fromCollegues.findIndex((x) => x.eCode === toColleageInput.value),
    //   1
    // );
  }
  onSubmit() {
    this.postData();
  }
  postData() {
    let fromValues = this.formService.form.getRawValue();
    console.log(fromValues);
    // *Kindly call the post data api here and post this data for new request. Modify the data according to the required format The from values contains the new data.
    // console.log(fromValues);
    let payload = {
      PernrFrom: fromValues.fromEmployee,
      PernrTo: fromValues.toEmployee,
      StartDate: fromValues.fromDate.getTime(), //*Convert it as required by backend
      EndDate: fromValues.toDate.getTime(),
      Mode: 'INS',
    };
    console.log(payload);
    // *Uncomment this
    // this.formService.postNewRequest(JSON.stringify(payload),this.csrfToken).subscribe((res) => {
    //   if (res.status == 200) {
    //     this.formService.form.reset();
    //     this.notificationService.success(`:: ${res.message}`);
    //     this.dialogRef.close(1);
    //   } else {
    //     this.notificationService.warn(':: Bad Request, Kindly Submit Again!!');
    //   }
    // });

    /// *Pls comment this (for nodejs)
    let data = {
      fromDate: getParsedDate(fromValues.fromDate),
      toDate: getParsedDate(fromValues.toDate),
      fromEmployeeCode: fromValues.fromEmployee,
      fromEmployeeName: this.findEmployeeName(fromValues.fromEmployee),
      toEmployeeCode: fromValues.toEmployee,
      toEmployeeName: this.findEmployeeName(fromValues.toEmployee),
    };

    this.formService.postNewRequest(data).subscribe((res) => {
      if (res.status == 200) {
        this.formService.form.reset();
        this.notificationService.success(`:: ${res.message}`);
        this.dialogRef.close(1);
      } else {
        this.notificationService.warn(':: Bad Request, Kindly Submit Again!!');
      }
    });
  }

  findEmployeeName(eCode) {
    return this.colleagues.find((colleage) => colleage.eCode === eCode).name;
  }
  clearForm() {
    this.formService.form.reset();
    this.setDate();
    this.fromCollegues = [...this.colleagues];
    this.toCollegues = [...this.colleagues];
  }
  onCancel() {
    this.formService.form.reset();
    this.dialogRef.close();
  }
}

function getParsedDate(date) {
  let dt1 = new Date(date);
  let dt1Day = dt1.getDate();
  let dt1Month = dt1.getMonth() + 1;
  let dt1Year = dt1.getFullYear();
  return `${dt1Day}-${dt1Month}-${dt1Year}`;
}
