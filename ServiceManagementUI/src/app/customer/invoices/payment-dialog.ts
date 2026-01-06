import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-payment-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
    ],
    template: `
    <div class="payment-dialog">
      <div class="dialog-header">
        <mat-icon class="header-icon">payment</mat-icon>
        <div>
          <h2 mat-dialog-title>Payment Details</h2>
          <p class="subtitle">Invoice #INV-{{data.invoice.invoiceId}}</p>
        </div>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="amount-display">
          <span class="label">Amount to Pay:</span>
          <span class="amount">₹{{data.invoice.totalAmount | number:'1.2-2'}}</span>
        </div>

        <div class="payment-method-section">
          <label class="section-label">Select Payment Method:</label>
          <mat-radio-group [(ngModel)]="paymentType" class="payment-options">
            <mat-radio-button value="UPI" class="payment-option">
              <div class="option-content">
                <mat-icon>qr_code_scanner</mat-icon>
                <div>
                  <strong>UPI Payment</strong>
                  <small>Pay using UPI apps like GPay, PhonePe, Paytm</small>
                </div>
              </div>
            </mat-radio-button>
            
            <mat-radio-button value="Cash" class="payment-option">
              <div class="option-content">
                <mat-icon>payments</mat-icon>
                <div>
                  <strong>Cash Payment</strong>
                  <small>Pay cash to technician upon service completion</small>
                </div>
              </div>
            </mat-radio-button>
          </mat-radio-group>
        </div>

        <mat-form-field appearance="outline" class="full-width" *ngIf="paymentType === 'UPI'">
          <mat-label>UPI ID</mat-label>
          <input matInput [(ngModel)]="upiId" placeholder="yourname@paytm" required>
          <mat-icon matPrefix>alternate_email</mat-icon>
          <mat-hint>Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)</mat-hint>
        </mat-form-field>

        <div class="info-note" *ngIf="paymentType === 'Cash'">
          <mat-icon>info</mat-icon>
          <p>Please keep the exact amount (₹{{data.invoice.totalAmount | number:'1.2-2'}}) ready. The technician will collect payment upon service completion.</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="!paymentType || (paymentType === 'UPI' && !upiId)"
          (click)="confirmPayment()">
          <mat-icon>check_circle</mat-icon>
          Confirm Payment
        </button>
      </mat-dialog-actions>
    </div>
  `,
    styles: [`
    .payment-dialog {
      max-width: 550px;
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
      gap: 16px;
    }

    .header-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    h2 {
      margin: 0;
      font-size: 22px;
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
      min-height: 250px;
    }

    .amount-display {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      padding: 20px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .amount-display .label {
      font-size: 16px;
      color: #6c757d;
      font-weight: 500;
    }

    .amount-display .amount {
      font-size: 28px;
      font-weight: 700;
      color: #667eea;
    }

    .payment-method-section {
      margin-bottom: 20px;
    }

    .section-label {
      display: block;
      font-weight: 600;
      margin-bottom: 16px;
      color: #2d3748;
      font-size: 15px;
    }

    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .payment-option {
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
    }

    .payment-option:hover {
      border-color: #667eea;
      background: #f7fafc;
    }

    ::ng-deep .payment-option.mat-mdc-radio-button.mat-accent.mat-mdc-radio-checked {
      border-color: #667eea;
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: 8px;
    }

    .option-content mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .option-content strong {
      display: block;
      font-size: 16px;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .option-content small {
      display: block;
      font-size: 13px;
      color: #718096;
    }

    .full-width {
      width: 100%;
      margin-top: 16px;
    }

    .info-note {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fff9e6;
      border-radius: 8px;
      border-left: 4px solid #ffc107;
      margin-top: 16px;
    }

    .info-note mat-icon {
      color: #ffc107;
      font-size: 24px;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .info-note p {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
      line-height: 1.5;
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
      margin: 0 -24px -24px;
      border-top: 1px solid #e9ecef;
    }
  `]
})
export class PaymentDialog {
    paymentType: string = '';
    upiId: string = '';

    constructor(
        public dialogRef: MatDialogRef<PaymentDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    confirmPayment(): void {
        if (this.paymentType && (this.paymentType !== 'UPI' || this.upiId)) {
            this.dialogRef.close({
                confirmed: true,
                paymentType: this.paymentType,
                upiId: this.upiId
            });
        }
    }
}
