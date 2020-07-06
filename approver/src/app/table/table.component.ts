import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { NotificationService } from '../shared/notification.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'fromDate',
    'toDate',
    'fromEmployeeCode',
    'fromEmployeeName',
    'fromBusiness',
    'fromBusinessClass',
    'toEmployeeCode',
    'toEmployeeName',
    'toBusiness',
    'toBusinessClass',
    'requesterCode',
    'requesterName',
    'requestedDate',
  ];
  dataSource: any = null;
  selection = new SelectionModel(true, []);
  selectedRows = [];
  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPendingData();
  }
  getPendingData() {
    this.dataSource = [];
    this.dataService.getPendingRequests().subscribe(
      (response: []) => {
        // console.log('Called Again');

        this.dataSource = new MatTableDataSource(
          response.map((res: {}) => {
            let newObj = res;
            newObj['fromBusiness'] = 'Retail';
            newObj['fromBusinessClass'] = 'SAP HR';
            newObj['toBusiness'] = 'Retail';
            newObj['toBusinessClass'] = 'Retail HR';
            newObj['requesterCode'] = '50048382';
            newObj['requesterName'] = 'Hiten Panchal';
            newObj['requestedDate'] = new Date();
            return newObj;
          })
        );
        console.log(this.dataSource);
      },
      (error) => {
        this.dataSource = [];
        this.notificationService.warn(':: Error in retrieving data!!');
      }
    );
  }
  isAllSelected() {
    // console.log(this.dataSource);
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  selectAll() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  openDialog(value) {
    const dialogConfig = new MatDialogConfig();
    //*To open this component inside dialog we need to instantialize in module
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.minWidth = 'fit-content';
    if (value) {
      this.dataService.setToApprove();
    }
    if (!value) {
      this.dataService.setToReject();
    }
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      result
        ? this.postRequest(value)
        : this.notificationService.success(':: Transaction Cancelled');
    });
  }
  postRequest(value) {
    if (value) {
      this.approveRequest();
    } else {
      this.rejectRequest();
    }
  }

  approveRequest() {
    let finalData = JSON.parse(JSON.stringify(this.selection.selected));
    this.getFinalData(finalData);
    // console.log(finalData);
    this.dataService.approveRequests(finalData).subscribe(
      (response) => {
        // console.log(response);
        this.getPendingData();
        this.notificationService.primary(':: Approved successfully!!');
      },
      (error) => {
        this.notificationService.warn(':: Error while approving requests!!');
      }
    );
  }
  rejectRequest() {
    let finalData = JSON.parse(JSON.stringify(this.selection.selected));
    this.getFinalData(finalData);
    // console.log(finalData);
    this.dataService.rejectRequests(finalData).subscribe(
      (response) => {
        // console.log(response);
        this.getPendingData();
        this.notificationService.info(':: Rejected successfully!!');
      },
      (error) => {
        this.notificationService.warn(':: Error while rejecting requests!!');
      }
    );
  }
  getFinalData(finalData) {
    finalData.forEach((data) => {
      delete data['fromBusiness'];
      delete data['fromBusinessClass'];
      delete data['toBusiness'];
      delete data['toBusinessClass'];
      delete data['requesterCode'];
      delete data['requesterName'];
      delete data['requestedDate'];
    });
    // console.log(finalData);
  }
}
