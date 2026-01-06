import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ServiceRequestService } from '../../../core/services/service-request.service';
import { NotifyService } from '../../../core/services/notify.service';
import { CustomerRequestDetailsDialog } from '../../customer-request-details-dialog/customer-request-details-dialog';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './my-requests.html',
  styleUrls: ['./my-requests.css']
})
export class MyRequests implements OnInit, AfterViewInit {
  requests: any[] = [];
  displayedColumns = ['requestId', 'serviceName', 'issueDescription', 'priority', 'status', 'scheduledDate', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  stats = { total: 0, pending: 0, completed: 0 };
  originalData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceRequestService: ServiceRequestService,
    private notify: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRequests(): void {
    this.serviceRequestService.getMyRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.originalData = requests;
        this.dataSource.data = requests;
        this.calculateStats();
      },
      error: () => this.notify.error('Failed to load requests')
    });
  }

  calculateStats(): void {
    this.stats.total = this.requests.length;
    this.stats.pending = this.requests.filter(r =>
      r.status === 'Requested' || r.status === 'Assigned' || r.status === 'InProgress'
    ).length;
    this.stats.completed = this.requests.filter(r => r.status === 'Completed').length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: string): void {
    if (status) {
      this.dataSource.data = this.originalData.filter(r => r.status === status);
    } else {
      this.dataSource.data = this.originalData;
    }
  }

  canCancel(status: string): boolean {
    return status === 'Requested';
  }

  viewDetails(request: any): void {
    this.dialog.open(CustomerRequestDetailsDialog, {
      width: '800px',
      maxWidth: '95vw',
      data: request,
      panelClass: 'request-details-dialog'
    });
  }

  cancelRequest(requestId: number): void {
    if (confirm('Are you sure you want to cancel this request?')) {
      const reason = prompt('Please provide a reason for cancellation:');
      if (reason) {
        this.serviceRequestService.cancelRequest(requestId, reason).subscribe({
          next: () => {
            this.notify.success('Request cancelled successfully');
            this.loadRequests();
          },
          error: () => this.notify.error('Failed to cancel request')
        });
      }
    }
  }

  giveFeedback(request: any): void {
    // Open the request details dialog which should have feedback functionality
    const dialogRef = this.dialog.open(CustomerRequestDetailsDialog, {
      width: '800px',
      maxWidth: '95vw',
      data: { ...request, showFeedbackForm: true },
      panelClass: 'request-details-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.feedbackSubmitted) {
        this.notify.success('Thank you for your feedback!');
        this.loadRequests();
      }
    });
  }
}
