import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(public snackbar: MatSnackBar) {}
  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };
  primary(msg) {
    this.config['panelClass'] = ['notification', 'bg-dark'];
    this.snackbar.open(msg, 'close', this.config);
  }
  success(msg) {
    this.config['panelClass'] = ['notification', 'bg-primary'];
    this.snackbar.open(msg, 'close', this.config);
  }
  warn(msg) {
    this.config['panelClass'] = ['notification', 'bg-danger'];
    this.snackbar.open(msg, 'close', this.config);
  }
  info(msg) {
    this.config['panelClass'] = ['notification', 'bg-info'];
    this.snackbar.open(msg, 'close', this.config);
  }
}
