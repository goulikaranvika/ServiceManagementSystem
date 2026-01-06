// Update notify.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(`✅ ${message}`, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  error(message: string): void {
    this.snackBar.open(`❌ ${message}`, 'Close', {
      duration: 8000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  warning(message: string): void {
    this.snackBar.open(`⚠️ ${message}`, 'Close', {
      duration: 6000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  info(message: string): void {
    this.snackBar.open(`ℹ️ ${message}`, 'Close', {
      duration: 4000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}