import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { OverviewService } from 'src/app/shared/overview.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
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
  // templateUrl: './table.component.html',
  templateUrl: './odataTable.component.html',
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
  // * For odata binding
  odataDisplayedColumns: string[] = [
    'select',
    'Begda',
    'Endda',
    'PernrFrom',
    'EnameFrom',
    'PernrTo',
    'EnameTo',
    'EnameApprover',
    'status',
  ];
  dataSource: any = null;
  selectedRows = [];

  // *Working with odata
  odataDataSource: any = null;
  constructor(
    public formService: FormService,
    private overviewService: OverviewService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getOverviewData();
  }
  getOverviewData() {
    this.selectedRows = [];
    this.dataSource = null;
    this.odataDataSource = null;

    // *This is for odata
    this.overviewService.getOdataPastRequests().subscribe((response) => {
      this.odataDataSource = [];
      // console.log(response);
      let array = [];
      response['entry'].forEach((element) => {
        array.push(element['content']['properties']);
      });
      // array.push(response['entry']['content']['properties']);
      this.odataDataSource = new MatTableDataSource(array);
    });

    // * This is for nodejs data comment this
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
      // *Here the splice function is working fine because element1 and element2 are  stored in same array because arrays are compared by references not values
      // console.log(this.selectedRows);
    }
  }

  newRequest() {
    this.openDialog(false); //*Cancel Button should be disabled
  }
  cancelRequest() {
    if (this.selectedRows.length < 1) {
      this.notificationService.info(':: Kindly select a request to delete.');
    } else if (this.selectedRows.length > 1) {
      this.notificationService.info(
        ':: Only one request can be deleted at a time.'
      );
    } else {
      // * This is for odata

      this.formService.populateForm({
        fromEmployee: `${this.selectedRows[0].EnameFrom} (${this.selectedRows[0].PernrFrom})`,
        toEmployee: `${this.selectedRows[0].EnameTo} (${this.selectedRows[0].PernrTo})`,
        fromDate: `${this.datePipe.transform(
          new Date(this.selectedRows[0].Begda),
          'MMMM d, y'
        )}`, //* Needs to changes the date format
        toDate: `${this.datePipe.transform(
          new Date(this.selectedRows[0].Endda),
          'MMMM d, y'
        )}`, //* Needs to changes the date
        cancel: false,
      });
      // *This is for nodejs data
      // this.formService.populateForm({
      //   fromEmployee: `${this.selectedRows[0].fromEmployeeName} (P${this.selectedRows[0].fromEmployeeCode})`,
      //   toEmployee: `${this.selectedRows[0].toEmployeeName} (P${this.selectedRows[0].toEmployeeCode})`,
      //   fromDate: `${this.selectedRows[0].fromDate}`,
      //   toDate: `${this.selectedRows[0].toDate}`,
      //   cancel: false,
      // });
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
    // dialogConfig.scrollStrategy.enable()
    dialogConfig.minWidth = '600px';
    if (!value) {
      //* For opening new request
      this.formService.initializeFormGroup();
      const dialogRef = this.dialog.open(FormComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        //* console.log(result);
        // *Have called the post new request api in form component itself
        if (result === 1) {
          this.getOverviewData();
        }
      });
    } else {
      //* For opening delete request
      const dialogRef = this.dialog.open(DeleteRequestComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // *Put this in a different function if unable to read
          // * Pls call the delete request api here.The data is in (this.selectedRows[0])
          this.postCancelRequest();
        }
      });
    }
  }

  postCancelRequest() {
    console.log(this.selectedRows[0]);
    let payload = {
      PernrFrom: this.selectedRows[0].PernrFrom,
      PernrTo: this.selectedRows[0].PernrTo,
      StartDate: new Date(this.selectedRows[0].Begda).getTime(), //*Convert it as per requirement
      EndDate: new Date(this.selectedRows[0].Endda).getTime(),
      Mode: 'CAN',
    };
    console.log(payload);
    // *Kindly send this payload for deleting request
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
}
