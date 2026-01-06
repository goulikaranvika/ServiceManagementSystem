import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ManagerService } from '../services/manager.service';
import { AssignTechnicianDialog } from '../assign-technician-dialog/assign-technician-dialog';

@Component({
  selector: 'app-request-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">assignment</mat-icon>
          <div>
            <h2 mat-dialog-title>Request Details</h2>
            <p class="subtitle">Request #{{data.requestId}}</p>
          </div>
        </div>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="details-grid">
          <!-- Customer Information -->
          <div class="detail-section">
            <h3><mat-icon>person</mat-icon> Customer Information</h3>
            <div class="detail-item">
              <span class="label">Name:</span>
              <span class="value">{{data.customerName}}</span>
            </div>
          </div>

          <!-- Service Information -->
          <div class="detail-section">
            <h3><mat-icon>build</mat-icon> Service Details</h3>
            <div class="detail-item">
              <span class="label">Service:</span>
              <span class="value">{{data.serviceName}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Category:</span>
              <span class="value">{{data.categoryName}}</span>
            </div>
          </div>

          <!-- Request Details -->
          <div class="detail-section full-width">
            <h3><mat-icon>description</mat-icon> Issue Description</h3>
            <p class="description">{{data.issueDescription}}</p>
          </div>

          <!-- Status & Priority -->
          <div class="detail-section">
            <h3><mat-icon>info</mat-icon> Status & Priority</h3>
            <div class="detail-item">
              <span class="label">Status:</span>
              <span class="status-badge" [ngClass]="'status-' + data.status?.toLowerCase()">
                {{data.status}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Priority:</span>
              <span class="status-badge" [ngClass]="'priority-' + data.priority?.toLowerCase()">
                {{data.priority}}
              </span>
            </div>
          </div>

          <!-- Dates -->
          <div class="detail-section">
            <h3><mat-icon>event</mat-icon> Important Dates</h3>
            <div class="detail-item">
              <span class="label">Created:</span>
              <span class="value">{{data.createdDate | date:'medium'}}</span>
            </div>
            <div class="detail-item" *ngIf="data.scheduledDate">
              <span class="label">Scheduled:</span>
              <span class="value">{{data.scheduledDate | date:'medium'}}</span>
            </div>
          </div>

          <!-- Location -->
          <div class="detail-section full-width">
            <h3><mat-icon>location_on</mat-icon> Service Location</h3>
            <div class="detail-item">
              <span class="label">Address:</span>
              <span class="value">{{data.serviceAddress}}</span>
            </div>
            <div class="detail-item">
              <span class="label">City:</span>
              <span class="value">{{data.serviceCity}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Pincode:</span>
              <span class="value">{{data.servicePincode}}</span>
            </div>
          </div>

          <!-- Cancellation Details (if cancelled) -->
          <div class="detail-section full-width cancellation-section" *ngIf="data.status === 'Cancelled'">
            <h3><mat-icon class="cancel-icon">cancel</mat-icon> Cancellation Details</h3>
            <div class="cancellation-card">
              <div class="detail-item">
                <span class="label">Reason:</span>
                <span class="value reason-text">{{data.cancelReason || 'No reason provided'}}</span>
              </div>
              <div class="detail-item" *ngIf="data.cancelledDate">
                <span class="label">Cancelled On:</span>
                <span class="value">{{data.cancelledDate | date:'medium'}}</span>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" *ngIf="data.status === 'Requested'" (click)="assignTechnician()">
          <mat-icon>assignment_ind</mat-icon>
          Assign Technician
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 800px;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 0;
    }

    .header-content {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .subtitle {
      margin: 4px 0 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .dialog-header button {
      color: white;
    }

    mat-dialog-content {
      padding: 24px !important;
      max-height: 70vh;
      overflow-y: auto;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .detail-section {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .detail-section.full-width {
      grid-column: 1 / -1;
    }

    .detail-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
      color: #667eea;
      font-size: 16px;
      font-weight: 600;
    }

    .detail-section h3 mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      gap: 16px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 500;
      color: #6c757d;
      min-width: 100px;
    }

    .value {
      color: #2d3748;
      font-weight: 500;
      text-align: right;
      flex: 1;
    }

    .description {
      color: #2d3748;
      line-height: 1.6;
      margin: 0;
      padding: 12px;
      background: white;
      border-radius: 8px;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-requested {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-assigned {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-inprogress {
      background: #fce4ec;
      color: #c2185b;
    }

    .status-completed {
      background: #e8f5e9;
      color: #388e3c;
    }

    .status-cancelled {
      background: #ffebee;
      color: #d32f2f;
    }

    .priority-high {
      background: #ffebee;
      color: #d32f2f;
    }

    .priority-medium {
      background: #fff3e0;
      color: #f57c00;
    }

    .priority-low {
      background: #e8f5e9;
      color: #388e3c;
    }

    .cancellation-section {
      background: #fff5f5;
      border-color: #feb2b2;
    }

    .cancellation-section h3 {
      color: #d32f2f;
    }

    .cancel-icon {
      color: #d32f2f !important;
    }

    .cancellation-card {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #d32f2f;
    }

    .reason-text {
      font-style: italic;
      color: #d32f2f;
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
      margin: 0 -24px -24px;
      border-top: 1px solid #e9ecef;
    }

    @media (max-width: 768px) {
      .details-grid {
        grid-template-columns: 1fr;
      }

      .detail-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .value {
        text-align: left;
      }
    }
  `]
})
export class RequestDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<RequestDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private managerService: ManagerService,
    private snackBar: MatSnackBar
  ) { }

  assignTechnician(): void {
    const assignDialogRef = this.dialog.open(AssignTechnicianDialog, {
      width: '600px',
      data: { requestId: this.data.requestId }
    });

    assignDialogRef.afterClosed().subscribe(selectedTechnician => {
      if (selectedTechnician) {
        console.log('Selected technician:', selectedTechnician);

        // Get technician ID (handle different field names)
        const technicianId = selectedTechnician.userId || selectedTechnician.id || selectedTechnician.technicianId;

        // Prepare assignment data to match API DTO (RequestId and TechnicianId with capital letters)
        const assignmentData = {
          RequestId: this.data.requestId,
          TechnicianId: technicianId
        };

        console.log('Sending assignment data:', assignmentData);

        // Call API to assign technician
        this.managerService.assignTechnician(assignmentData).subscribe({
          next: (response) => {
            console.log('Assignment successful:', response);
            this.snackBar.open('Technician assigned successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            // Close this dialog and signal refresh
            this.dialogRef.close({ action: 'assigned', refresh: true });
          },
          error: (err) => {
            console.error('Error assigning technician:', err);
            console.error('Error status:', err.status);
            console.error('Error message:', err.message);
            console.error('Error details:', err.error);

            let errorMessage = 'Failed to assign technician. Please try again.';
            if (err.error?.message) {
              errorMessage = err.error.message;
            } else if (err.error?.title) {
              errorMessage = err.error.title;
            }

            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}
