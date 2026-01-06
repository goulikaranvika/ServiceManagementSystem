import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-request-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">receipt_long</mat-icon>
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

          <!-- Issue Description -->
          <div class="detail-section full-width">
            <h3><mat-icon>description</mat-icon> Issue Description</h3>
            <p class="description">{{data.issueDescription}}</p>
          </div>

          <!-- Technician Information (if assigned) -->
          <div class="detail-section full-width technician-section" *ngIf="data.technicianName">
            <h3><mat-icon class="tech-icon">engineering</mat-icon> Assigned Technician</h3>
            <div class="technician-card">
              <div class="tech-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div class="tech-info">
                <div class="detail-item">
                  <span class="label">Name:</span>
                  <span class="value tech-name">{{data.technicianName}}</span>
                </div>
                <div class="detail-item" *ngIf="data.technicianPhone">
                  <span class="label">Phone:</span>
                  <span class="value">
                    <mat-icon class="inline-icon">phone</mat-icon>
                    {{data.technicianPhone}}
                  </span>
                </div>
                <div class="detail-item" *ngIf="data.technicianEmail">
                  <span class="label">Email:</span>
                  <span class="value">
                    <mat-icon class="inline-icon">email</mat-icon>
                    {{data.technicianEmail}}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- No Technician Assigned -->
          <div class="detail-section full-width no-tech-section" *ngIf="!data.technicianName && data.status === 'Requested'">
            <h3><mat-icon>info</mat-icon> Technician Assignment</h3>
            <div class="info-card">
              <mat-icon class="info-icon">schedule</mat-icon>
              <p>A technician will be assigned to your request soon.</p>
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
          <div class="detail-section">
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

          <!-- Feedback Form (for completed services) -->
          <div class="detail-section full-width feedback-section" *ngIf="data.status === 'Completed' && data.showFeedbackForm">
            <h3><mat-icon class="feedback-icon">rate_review</mat-icon> Give Feedback</h3>
            <div class="feedback-card">
              <div class="rating-section">
                <label>Rating:</label>
                <div class="star-rating">
                  <mat-icon *ngFor="let star of [1,2,3,4,5]" 
                            (click)="rating = star"
                            [class.selected]="star <= rating">
                    {{star <= rating ? 'star' : 'star_border'}}
                  </mat-icon>
                </div>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Comments</mat-label>
                <textarea matInput [(ngModel)]="comments" rows="4" 
                          placeholder="Share your experience with our service..."></textarea>
              </mat-form-field>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" 
                *ngIf="data.status === 'Completed' && data.showFeedbackForm"
                [disabled]="rating === 0"
                (click)="submitFeedback()">
          <mat-icon>send</mat-icon>
          Submit Feedback
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
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
    }

    .inline-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #667eea;
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

    /* Technician Section */
    .technician-section {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      border-color: #667eea;
    }

    .tech-icon {
      color: #667eea !important;
    }

    .technician-card {
      background: white;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .tech-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .tech-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .tech-info {
      flex: 1;
    }

    .tech-name {
      color: #667eea;
      font-weight: 600;
      font-size: 1.1rem;
    }

    /* No Technician Section */
    .no-tech-section {
      background: #fff9e6;
      border-color: #ffc107;
    }

    .info-card {
      background: white;
      padding: 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .info-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #ffc107;
    }

    .info-card p {
      margin: 0;
      color: #6c757d;
    }

    /* Cancellation Section */
    .cancellation-section {
      background: #fff5f5;
      border-color: #feb2b2;
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
        justify-content: flex-start;
      }

      .technician-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .feedback-section {
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        border-radius: 16px;
        padding: 24px;
      }

      .feedback-card {
        margin-top: 16px;
      }

      .rating-section {
        margin-bottom: 20px;
      }

      .rating-section label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #2d3748;
      }

      .star-rating {
        display: flex;
        gap: 8px;
      }

      .star-rating mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        cursor: pointer;
        color: #d1d5db;
        transition: all 0.2s ease;
      }

      .star-rating mat-icon.selected {
        color: #fbbf24;
      }

      .star-rating mat-icon:hover {
        transform: scale(1.1);
      }

      .full-width {
        width: 100%;
      }
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
        justify-content: flex-start;
      }

      .technician-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class CustomerRequestDetailsDialog {
  rating: number = 0;
  comments: string = '';

  constructor(
    public dialogRef: MatDialogRef<CustomerRequestDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  submitFeedback(): void {
    if (this.rating > 0) {
      this.dialogRef.close({
        feedbackSubmitted: true,
        rating: this.rating,
        comments: this.comments
      });
    }
  }
}
