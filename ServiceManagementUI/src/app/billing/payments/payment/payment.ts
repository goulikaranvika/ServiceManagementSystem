import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { BillingService } from '../../services/billing.service';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  template: `
    <div class="payments-container">
      <h2>Payment History</h2>
      
      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">payment</mat-icon>
              <div class="stat-text">
                <h3>{{totalPayments}}</h3>
                <p>Total Payments</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">attach_money</mat-icon>
              <div class="stat-text">
                <h3>\${{totalPaidAmount}}</h3>
                <p>Total Paid</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">check_circle</mat-icon>
              <div class="stat-text">
                <h3>{{successfulPayments}}</h3>
                <p>Successful</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <table mat-table [dataSource]="payments" class="mat-elevation-8">
        <ng-container matColumnDef="paymentId">
          <th mat-header-cell *matHeaderCellDef>Payment ID</th>
          <td mat-cell *matCellDef="let payment">{{payment.paymentId}}</td>
        </ng-container>

        <ng-container matColumnDef="invoiceId">
          <th mat-header-cell *matHeaderCellDef>Invoice ID</th>
          <td mat-cell *matCellDef="let payment">{{payment.invoiceId}}</td>
        </ng-container>

        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let payment">\${{payment.amount}}</td>
        </ng-container>

        <ng-container matColumnDef="paymentMethod">
          <th mat-header-cell *matHeaderCellDef>Payment Method</th>
          <td mat-cell *matCellDef="let payment">{{payment.paymentMethod}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let payment">
            <mat-chip [class]="'status-' + payment.status.toLowerCase()">
              {{payment.status}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="paymentDate">
          <th mat-header-cell *matHeaderCellDef>Payment Date</th>
          <td mat-cell *matCellDef="let payment">{{payment.paymentDate | date:'short'}}</td>
        </ng-container>

        <ng-container matColumnDef="transactionId">
          <th mat-header-cell *matHeaderCellDef>Transaction ID</th>
          <td mat-cell *matCellDef="let payment">{{payment.transactionId}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let payment">
            <button mat-icon-button (click)="viewReceipt(payment)" title="View Receipt">
              <mat-icon>receipt</mat-icon>
            </button>
            <button mat-icon-button (click)="downloadReceipt(payment)" title="Download Receipt">
              <mat-icon>download</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .payments-container { padding: 20px; }
    .stats-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat-card { text-align: center; }
    .stat-content { display: flex; align-items: center; justify-content: center; gap: 15px; }
    .stat-icon { font-size: 48px; color: #3f51b5; }
    .stat-text h3 { margin: 0; font-size: 2em; color: #3f51b5; }
    .stat-text p { margin: 0; color: #666; }
    table { width: 100%; }
    .status-completed { background-color: #4caf50; color: white; }
    .status-pending { background-color: #ff9800; color: white; }
    .status-failed { background-color: #f44336; color: white; }
  `]
})
export class Payment implements OnInit {
  payments: any[] = [];
  totalPayments = 0;
  totalPaidAmount = 0;
  successfulPayments = 0;
  displayedColumns = ['paymentId', 'invoiceId', 'amount', 'paymentMethod', 'status', 'paymentDate', 'transactionId', 'actions'];

  constructor(
    private billingService: BillingService,
    private notify: NotifyService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
    this.loadStats();
  }

  loadPayments(): void {
    this.billingService.getMyPayments().subscribe({
      next: (payments) => this.payments = payments,
      error: () => this.notify.error('Failed to load payments')
    });
  }

  loadStats(): void {
    this.billingService.getPaymentStats().subscribe({
      next: (stats) => {
        this.totalPayments = stats.totalPayments;
        this.totalPaidAmount = stats.totalPaidAmount;
        this.successfulPayments = stats.successfulPayments;
      },
      error: () => this.notify.error('Failed to load stats')
    });
  }

  viewReceipt(payment: any): void {
    this.notify.info('Receipt details dialog would open here');
  }

  downloadReceipt(payment: any): void {
    this.billingService.downloadReceipt(payment.paymentId).subscribe({
      next: () => this.notify.success('Receipt downloaded successfully'),
      error: () => this.notify.error('Failed to download receipt')
    });
  }
}
