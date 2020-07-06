import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { OverviewService } from 'src/app/shared/overview.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { FormService } from 'src/app/shared/form.service';
import { DeleteRequestComponent } from '../delete-request/delete-request.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [],
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'fromDate',
    'toDate',
    'fromEmployeeCode',
    'fromEmployeeName',
    'toEmployeeCode',
    'toEmployeeName',
    'approver',
    'status',
  ];
  dataSource: any = null;
  selectedRows = [];
  constructor(
    public formService: FormService,
    private overviewService: OverviewService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getOverviewData();
  }
  getOverviewData() {
    this.selectedRows = [];
    this.dataSource = null;
    this.overviewService.getPastRequests().subscribe(
      (response) => {
        this.dataSource = response;
        this.dataSource = new MatTableDataSource(this.dataSource);
      },
      (error) => {
        console.log(error);
        this.notificationService.config.duration = 10000;
        this.notificationService.warn(`Error 404 : Not found`);
        this.dataSource = [];
      }
    );
  }
  onRowSelection(element1, event) {
    if (event.checked) {
      this.selectedRows.push(element1);
      // console.log(this.selectedRows);
    } else {
      this.selectedRows.splice(
        this.selectedRows.findIndex((element2) => element1 === element2),
        1
      );
      // *Here the splice function is working fine because element1 and element2 are in same stored in same array because arrays compares by references
      // console.log(this.selectedRows);
    }
  }

  newRequest() {
    this.openDialog(false); //*Cancel Button should be disabled
  }
  cancelRequest() {
    if (this.selectedRows.length < 1) {
      this.notificationService.warn(':: Kindly select a request to delete.');
    } else if (this.selectedRows.length > 1) {
      this.notificationService.warn(
        ':: Only one request can be deleted at a time.'
      );
    } else {
      this.formService.populateForm({
        fromEmployee: `${this.selectedRows[0].fromEmployeeName} (P${this.selectedRows[0].fromEmployeeCode})`,
        toEmployee: `${this.selectedRows[0].toEmployeeName} (P${this.selectedRows[0].toEmployeeCode})`,
        fromDate: `${this.selectedRows[0].fromDate}`,
        toDate: `${this.selectedRows[0].toDate}`,
        cancel: false,
      });
      this.openDialog(true); //*Cancel Button should be enabled
    }
  }
  openDialog(value) {
    this.formService.setCancelBtn(value);
    const dialogConfig = new MatDialogConfig();
    //*To open this component inside dialog we need to instantialize in module
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '600px';
    if (!value) {
      this.formService.initializeFormGroup();
      const dialogRef = this.dialog.open(FormComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        // console.log(result);
        if (result === 1) {
          this.getOverviewData();
        }
      });
    } else {
      const dialogRef = this.dialog.open(DeleteRequestComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // console.log(this.selectedRows[0]);
          this.formService
            .deleteRequest(this.selectedRows[0])
            .subscribe((response) => {
              if (response.status == 200) {
                this.formService.form.reset();
                this.notificationService.success(`:: ${response.message}`);
                this.getOverviewData();
              } else {
                this.notificationService.info(
                  ':: Bad Request, Kindly Submit Again!!'
                );
              }
            });
        }
      });
    }
  }
}
