import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/shared/form.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-request',
  templateUrl: './delete-request.component.html',
  styleUrls: ['./delete-request.component.css'],
})
export class DeleteRequestComponent implements OnInit {
  formValues = {};
  constructor(
    public formService: FormService,
    public dialogRef: MatDialogRef<DeleteRequestComponent>
  ) {}

  ngOnInit(): void {
    // console.log(this.formService.form);
    // for (let key in this.formService.form.controls) {
    //   console.log(this.formService.form.controls[`${key}`].value);
    // }
  }
  onSubmit() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
}
