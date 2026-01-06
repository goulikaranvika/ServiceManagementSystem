import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ManagerService } from '../services/manager.service';
import { NotifyService } from '../../core/services/notify.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { RequestDetailsDialog } from '../request-details-dialog/request-details-dialog';

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatChipsModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatCardModule, MatDialogModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>Service Requests Management</h1>
        <p>Monitor and assign service requests to technicians</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.total}}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.unassigned}}</h3>
            <p>Unassigned</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: #fff3e0; color: #f57c00;">
            <mat-icon>engineering</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.inProgress}}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.completed}}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filter-card">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search by customer, service...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select (selectionChange)="filterByStatus($event.value)">
              <mat-option value="">All</mat-option>
              <mat-option value="Requested">Requested</mat-option>
              <mat-option value="Assigned">Assigned</mat-option>
              <mat-option value="InProgress">In Progress</mat-option>
              <mat-option value="Completed">Completed</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select (selectionChange)="filterByPriority($event.value)">
              <mat-option value="">All</mat-option>
              <mat-option value="High">High</mat-option>
              <mat-option value="Medium">Medium</mat-option>
              <mat-option value="Low">Low</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Table -->
      <div class="content-card">
        <table mat-table [dataSource]="dataSource" matSort class="requests-table">
          <ng-container matColumnDef="requestId">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let request">
              <strong>#{{request.requestId}}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
            <td mat-cell *matCellDef="let request">
              <div class="customer-info">
                <mat-icon class="small-icon">person</mat-icon>
                {{request.customerName}}
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="service">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Service</th>
            <td mat-cell *matCellDef="let request">
              <div class="service-info">
                <strong>{{request.serviceName}}</strong>
                <small>{{request.categoryName}}</small>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
            <td mat-cell *matCellDef="let request">
              <span class="status-badge priority-{{request.priority?.toLowerCase()}}">
                {{request.priority}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let request">
              <span class="status-badge status-{{request.status?.toLowerCase()}}">
                {{request.status}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="createdDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
            <td mat-cell *matCellDef="let request">
              {{request.createdDate | date:'MMM d, y'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let request">
              <button mat-icon-button color="primary" (click)="viewDetails(request)" 
                      matTooltip="View Details">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="assignTechnician(request)" 
                      *ngIf="request.status === 'Requested'" matTooltip="Assign Technician">
                <mat-icon>assignment_ind</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>

        <div *ngIf="dataSource.data.length === 0" class="empty-state">
          <mat-icon>inbox</mat-icon>
          <h3>No Service Requests</h3>
          <p>There are no service requests to display</p>
        </div>

        <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" 
                       showFirstLastButtons
                       *ngIf="dataSource.data.length > 0">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .filter-card {
      margin-bottom: 24px;
      padding: 16px;
    }

    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filters mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .requests-table {
      width: 100%;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: var(--bg-tertiary);
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .small-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-secondary);
    }

    .service-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .service-info strong {
      color: var(--text-primary);
    }

    .service-info small {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }
  `]
})
export class ServiceRequests implements OnInit, AfterViewInit {
  serviceRequests: any[] = [];
  displayedColumns = ['requestId', 'customer', 'service', 'priority', 'status', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  stats = { total: 0, unassigned: 0, inProgress: 0, completed: 0 };
  originalData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private managerService: ManagerService,
    private notify: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadServiceRequests();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadServiceRequests(): void {
    this.managerService.getServiceRequests().subscribe({
      next: (requests) => {
        this.serviceRequests = requests;
        this.originalData = requests;
        this.dataSource.data = requests;
        this.calculateStats();
      },
      error: () => this.notify.error('Failed to load service requests')
    });
  }

  calculateStats(): void {
    this.stats.total = this.serviceRequests.length;
    this.stats.unassigned = this.serviceRequests.filter(r => r.status === 'Requested').length;
    this.stats.inProgress = this.serviceRequests.filter(r => r.status === 'InProgress').length;
    this.stats.completed = this.serviceRequests.filter(r => r.status === 'Completed').length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: string): void {
    this.applyFilters({ status });
  }

  filterByPriority(priority: string): void {
    this.applyFilters({ priority });
  }

  private applyFilters(filters: { status?: string, priority?: string }): void {
    let filtered = this.originalData;

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(r => r.priority === filters.priority);
    }

    this.dataSource.data = filtered;
  }

  viewDetails(request: any): void {
    const dialogRef = this.dialog.open(RequestDetailsDialog, {
      width: '800px',
      maxWidth: '95vw',
      data: request,
      panelClass: 'request-details-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.refresh) {
        // Refresh the service requests list after assignment
        this.loadServiceRequests();
      }
    });
  }

  assignTechnician(request: any): void {
    // This method is called from the quick assign button in the table
    // Open the request details dialog which has the assign technician functionality
    this.viewDetails(request);
  }
}
