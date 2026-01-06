import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BillingService } from '../../core/services/billing.service';
import { NotifyService } from '../../core/services/notify.service';
import { PaymentDialog } from './payment-dialog';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatChipsModule, MatCardModule, MatDialogModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>My Invoices</h1>
        <p>View and manage your service invoices and payments</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>receipt</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.totalInvoices}}</h3>
            <p>Total Invoices</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>pending</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.pendingPayments}}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.paidInvoices}}</h3>
            <p>Paid</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: #e3f2fd; color: #1976d2;">
            <mat-icon>attach_money</mat-icon>
          </div>
          <div class="stat-content">
            <h3>₹{{stats.totalAmount | number:'1.2-2'}}</h3>
            <p>Total Amount</p>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="content-card">
        <div class="content-card-header">
          <h3>Invoice History</h3>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="invoices-table">
          <ng-container matColumnDef="invoiceId">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Invoice #</th>
            <td mat-cell *matCellDef="let invoice">
              <strong>#INV-{{invoice.invoiceId}}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="serviceName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Service</th>
            <td mat-cell *matCellDef="let invoice">
              <div class="service-info">
                <strong>{{invoice.serviceName}}</strong>
                <small>Request #{{invoice.requestId}}</small>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="subTotal">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Base Amount</th>
            <td mat-cell *matCellDef="let invoice">
              ₹{{invoice.subTotal | number:'1.2-2'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="taxAmount">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Tax (18%)</th>
            <td mat-cell *matCellDef="let invoice">
              ₹{{invoice.taxAmount | number:'1.2-2'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="totalAmount">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Amount</th>
            <td mat-cell *matCellDef="let invoice">
              <strong class="amount">₹{{invoice.totalAmount | number:'1.2-2'}}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="invoiceDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Invoice Date</th>
            <td mat-cell *matCellDef="let invoice">
              {{invoice.invoiceDate | date:'MMM d, y'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="paymentStatus">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let invoice">
              <span class="status-badge" [ngClass]="'status-' + invoice.paymentStatus?.toLowerCase()">
                {{invoice.paymentStatus}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let invoice">
              <button mat-icon-button color="primary" (click)="viewInvoice(invoice)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-raised-button color="accent" (click)="payInvoice(invoice)" 
                      *ngIf="invoice.paymentStatus === 'Pending'">
                <mat-icon>payment</mat-icon>
                Pay Now
              </button>
              <button mat-icon-button (click)="downloadInvoice(invoice)">
                <mat-icon>download</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>

        <div *ngIf="dataSource.data.length === 0" class="empty-state">
          <mat-icon>receipt_long</mat-icon>
          <h3>No Invoices Yet</h3>
          <p>Your invoices will appear here after service completion</p>
        </div>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 50]" 
                       showFirstLastButtons
                       *ngIf="dataSource.data.length > 0">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(45deg, var(--primary-color), #64b5f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
    }

    .stat-icon.primary { background: rgba(33, 150, 243, 0.1); color: #2196f3; }
    .stat-icon.warning { background: rgba(255, 152, 0, 0.1); color: #ff9800; }
    .stat-icon.success { background: rgba(76, 175, 80, 0.1); color: #4caf50; }

    .stat-content h3 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .stat-content p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .content-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }

    .content-card-header {
      margin-bottom: 24px;
    }

    .content-card-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .invoices-table {
      width: 100%;
      background: transparent;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending { background: #fff3e0; color: #ef6c00; }
    .status-paid { background: #e8f5e9; color: #2e7d32; }

    .service-info {
      display: flex;
      flex-direction: column;
    }

    .service-info strong {
      font-size: 1rem;
      color: var(--text-primary);
    }

    .service-info small {
      color: var(--text-secondary);
    }

    .amount {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary-color);
    }

    .empty-state {
      text-align: center;
      padding: 60px 0;
      color: var(--text-secondary);
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
    }
  `]
})
export class InvoicesComponent implements OnInit, AfterViewInit {
  invoices: any[] = [];
  displayedColumns = ['invoiceId', 'serviceName', 'subTotal', 'taxAmount', 'totalAmount', 'invoiceDate', 'paymentStatus', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  stats = { totalInvoices: 0, pendingPayments: 0, paidInvoices: 0, totalAmount: 0 };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private billingService: BillingService,
    private notify: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInvoices(): void {
    this.billingService.getMyInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.dataSource.data = invoices;
        this.calculateStats();
      },
      error: () => this.notify.error('Failed to load invoices')
    });
  }

  calculateStats(): void {
    this.stats.totalInvoices = this.invoices.length;
    this.stats.pendingPayments = this.invoices.filter(i => i.paymentStatus === 'Pending').length;
    this.stats.paidInvoices = this.invoices.filter(i => i.paymentStatus === 'Paid').length;
    this.stats.totalAmount = this.invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  }

  viewInvoice(invoice: any): void {
    this.notify.info(`Viewing invoice #INV-${invoice.invoiceId}`);
    // TODO: Open invoice detail dialog
  }

  payInvoice(invoice: any): void {
    const dialogRef = this.dialog.open(PaymentDialog, {
      width: '550px',
      data: { invoice }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        const { paymentType, upiId } = result;

        this.billingService.confirmPayment(invoice.invoiceId, Number(invoice.totalAmount), paymentType).subscribe({
          next: () => {
            const successMsg = paymentType === 'UPI'
              ? `✓ Payment of ₹${invoice.totalAmount} successful via UPI (${upiId})!`
              : `✓ Payment of ₹${invoice.totalAmount} confirmed. Pay cash to technician upon service completion.`;
            this.notify.success(successMsg);
            this.loadInvoices();
          },
          error: (error) => {
            console.error('Payment error:', error);
            this.notify.error('✗ Payment failed. Please try again.');
          }
        });
      }
    });
  }

  downloadInvoice(invoice: any): void {
    this.notify.info(`Downloading invoice #INV-${invoice.invoiceId}`);
    // TODO: Implement PDF download
  }
}
