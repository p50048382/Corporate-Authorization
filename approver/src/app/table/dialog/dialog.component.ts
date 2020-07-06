import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public dataService: DataService
  ) {}
  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onYesClick() {
    this.dialogRef.close(true);
  }
}
