import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { BillingService } from '../../services/billing.service';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  template: `
    <div class="invoices-container">
      <h2>Invoices</h2>
      
      <table mat-table [dataSource]="dataSource" class="mat-elevation-8">
        <ng-container matColumnDef="invoiceNumber">
          <th mat-header-cell *matHeaderCellDef>Invoice #</th>
          <td mat-cell *matCellDef="let invoice">{{invoice.invoiceNumber}}</td>
        </ng-container>

        <ng-container matColumnDef="serviceName">
          <th mat-header-cell *matHeaderCellDef>Service</th>
          <td mat-cell *matCellDef="let invoice">{{invoice.serviceName}}</td>
        </ng-container>

        <ng-container matColumnDef="totalAmount">
          <th mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let invoice">\${{invoice.totalAmount}}</td>
        </ng-container>

        <ng-container matColumnDef="paymentStatus">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let invoice">
            <mat-chip [class]="'status-' + invoice.paymentStatus?.toLowerCase()">
              {{invoice.paymentStatus}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="invoiceDate">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let invoice">{{invoice.invoiceDate | date:'short'}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let invoice">
            <button mat-icon-button (click)="viewInvoice(invoice)" title="View Invoice">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button (click)="downloadInvoice(invoice)" title="Download">
              <mat-icon>download</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: [`
    .invoices-container { padding: 20px; }
    table { width: 100%; }
    .status-paid { background-color: #4caf50; color: white; }
    .status-pending { background-color: #ff9800; color: white; }
    .status-overdue { background-color: #f44336; color: white; }
  `]
})
export class InvoiceList implements OnInit, AfterViewInit {
  invoices: any[] = [];
  displayedColumns = ['invoiceNumber', 'serviceName', 'totalAmount', 'paymentStatus', 'invoiceDate', 'actions'];
  dataSource = new MatTableDataSource(this.invoices);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private billingService: BillingService,
    private notify: NotifyService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadInvoices(): void {
    this.billingService.getMyInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.dataSource.data = invoices;
      },
      error: () => this.notify.error('Failed to load invoices')
    });
  }

  viewInvoice(invoice: any): void {
    this.notify.info('Invoice details dialog would open here');
  }

  downloadInvoice(invoice: any): void {
    this.billingService.downloadInvoice(invoice.invoiceId).subscribe({
      next: () => this.notify.success('Invoice downloaded successfully'),
      error: () => this.notify.error('Failed to download invoice')
    });
  }
}
