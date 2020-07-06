import { Component, OnInit, Inject } from '@angular/core';

import { NotificationService } from 'src/app/shared/notification.service';
import { FormService } from 'src/app/shared/form.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  colleagues: any = [];
  fromCollegues: any = [];
  toCollegues: any = [];
  constructor(
    public formService: FormService,
    public dialogRef: MatDialogRef<HomeComponent>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // console.log(this.formService.form.value);
    this.getColleaguesData();
  }
  getColleaguesData() {
    this.formService.getColleagues().subscribe((response) => {
      this.colleagues = response;
      this.fromCollegues = [...this.colleagues];
      this.toCollegues = [...this.colleagues];
    });
  }
  onFromColleagueChange(fromColleageInput) {
    // * change in toCollegues drop down array
    this.toCollegues = [...this.colleagues];
    this.toCollegues.splice(
      this.toCollegues.findIndex((x) => x.eCode === fromColleageInput.value),
      1
    );
  }
  onToColleagueChange(toColleageInput) {
    // * change in fromCollegues drop down array
    this.fromCollegues = [...this.colleagues];
    this.fromCollegues.splice(
      this.fromCollegues.findIndex((x) => x.eCode === toColleageInput.value),
      1
    );
  }
  onSubmit() {
    this.postData();
  }
  postData() {
    let fromValues = this.formService.form.getRawValue();
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
