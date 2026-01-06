import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BillingService } from '../../services/billing.service';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <h2 mat-dialog-title>Make Payment</h2>
    
    <mat-dialog-content>
      <div class="invoice-summary">
        <mat-card>
          <mat-card-content>
            <h4>Invoice Summary</h4>
            <div class="summary-row">
              <span>Invoice ID:</span>
              <span>{{data.invoice.invoiceId}}</span>
            </div>
            <div class="summary-row">
              <span>Service:</span>
              <span>{{data.invoice.serviceName}}</span>
            </div>
            <div class="summary-row">
              <span>Total Amount:</span>
              <span>\${{data.invoice.totalAmount}}</span>
            </div>
            <div class="summary-row">
              <span>Paid Amount:</span>
              <span>\${{data.invoice.paidAmount}}</span>
            </div>
            <div class="summary-row highlight">
              <span>Remaining Amount:</span>
              <span>\${{data.invoice.remainingAmount}}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Payment Amount</mat-label>
          <input matInput type="number" formControlName="amount" 
                 [max]="data.invoice.remainingAmount" min="1">
          <mat-hint>Maximum: \${{data.invoice.remainingAmount}}</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Payment Method</mat-label>
          <mat-select formControlName="paymentMethod">
            <mat-option value="CreditCard">Credit Card</mat-option>
            <mat-option value="DebitCard">Debit Card</mat-option>
            <mat-option value="PayPal">PayPal</mat-option>
            <mat-option value="BankTransfer">Bank Transfer</mat-option>
            <mat-option value="Cash">Cash</mat-option>
          </mat-select>
        </mat-form-field>

        <div *ngIf="paymentForm.get('paymentMethod')?.value === 'CreditCard' || paymentForm.get('paymentMethod')?.value === 'DebitCard'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Card Number</mat-label>
            <input matInput formControlName="cardNumber" placeholder="1234 5678 9012 3456">
          </mat-form-field>

          <div class="card-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Expiry Date</mat-label>
              <input matInput formControlName="expiryDate" placeholder="MM/YY">
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>CVV</mat-label>
              <input matInput formControlName="cvv" placeholder="123">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cardholder Name</mat-label>
            <input matInput formControlName="cardholderName">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Payment Notes (Optional)</mat-label>
          <textarea matInput formControlName="notes" rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" 
              [disabled]="!paymentForm.valid || processing">
        <mat-icon *ngIf="processing">hourglass_empty</mat-icon>
        <mat-icon *ngIf="!processing">payment</mat-icon>
        {{ processing ? 'Processing...' : 'Pay $' + paymentForm.get('amount')?.value }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .invoice-summary { margin-bottom: 20px; }
    .summary-row { display: flex; justify-content: space-between; margin: 8px 0; }
    .highlight { font-weight: bold; color: #3f51b5; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .card-row { display: flex; gap: 16px; }
    .half-width { flex: 1; margin-bottom: 16px; }
  `]
})
export class PaymentDialog {
  paymentForm: FormGroup;
  processing = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private billingService: BillingService,
    private notify: NotifyService
  ) {
    this.paymentForm = this.fb.group({
      amount: [data.invoice.remainingAmount, [Validators.required, Validators.min(1), Validators.max(data.invoice.remainingAmount)]],
      paymentMethod: ['', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      cardholderName: [''],
      notes: ['']
    });

    // Add validators for card fields when card payment is selected
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      if (method === 'CreditCard' || method === 'DebitCard') {
        cardFields.forEach(field => {
          this.paymentForm.get(field)?.setValidators([Validators.required]);
        });
      } else {
        cardFields.forEach(field => {
          this.paymentForm.get(field)?.clearValidators();
        });
      }
      cardFields.forEach(field => {
        this.paymentForm.get(field)?.updateValueAndValidity();
      });
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.processing = true;
      const paymentData = {
        invoiceId: this.data.invoice.invoiceId,
        ...this.paymentForm.value
      };

      this.billingService.makePayment(paymentData).subscribe({
        next: () => {
          this.notify.success('Payment processed successfully!');
          this.dialogRef.close(true);
        },
        error: () => {
          this.notify.error('Payment failed. Please try again.');
          this.processing = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

