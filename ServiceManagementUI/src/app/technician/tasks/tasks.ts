import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TechnicianService } from '../services/technician.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatCardModule,
    MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>My Assigned Tasks</h1>
        <p>Manage and update your service assignments</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>task</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.total}}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{stats.assigned}}</h3>
            <p>Assigned</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
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
            <mat-label>Search Tasks</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search by service or address...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status Filter</mat-label>
            <mat-select (selectionChange)="filterByStatus($event.value)">
              <mat-option value="">All Statuses</mat-option>
              <mat-option value="Assigned">Assigned</mat-option>
              <mat-option value="InProgress">In Progress</mat-option>
              <mat-option value="Completed">Completed</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Table -->
      <div class="content-card">
        <table mat-table [dataSource]="dataSource" matSort class="tasks-table">
          <ng-container matColumnDef="requestId">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let task">
              <strong>#{{task.requestId}}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="serviceName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Service & Customer</th>
            <td mat-cell *matCellDef="let task">
              <div class="service-info">
                <strong>{{task.serviceName}}</strong>
                <span class="customer-name">👤 {{task.customerName}}</span>
                <small>{{task.categoryName}}</small>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="workStatus">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status & Actions</th>
            <td mat-cell *matCellDef="let task">
              <div class="status-action">
                <mat-form-field appearance="fill" class="status-dropdown-field">
                  <mat-select [(value)]="task.selectedStatus" [disabled]="task.updating">
                    <mat-option value="Assigned">Assigned</mat-option>
                    <mat-option value="InProgress">In Progress</mat-option>
                    <mat-option value="Completed">Completed</mat-option>
                  </mat-select>
                </mat-form-field>
                <button 
                  mat-raised-button 
                  color="primary" 
                  class="update-btn"
                  [disabled]="task.selectedStatus === task.workStatus || task.updating"
                  (click)="confirmStatusUpdate(task)">
                  <mat-spinner *ngIf="task.updating" diameter="20"></mat-spinner>
                  <mat-icon *ngIf="!task.updating">update</mat-icon>
                  {{ task.updating ? 'Updating...' : 'Update' }}
                </button>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="scheduledDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Scheduled</th>
            <td mat-cell *matCellDef="let task">
              {{task.scheduledDate | date:'MMM d, y, h:mm a'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Location</th>
            <td mat-cell *matCellDef="let task">
              <div class="location-info">
                <mat-icon class="small-icon">place</mat-icon>
                <span>{{task.serviceAddress}}, {{task.serviceCity}}</span>
                <span *ngIf="task.customerPhoneNumber"> • 📞 {{task.customerPhoneNumber}}</span>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>

        <div *ngIf="dataSource.data.length === 0" class="empty-state">
          <mat-icon>assignment_late</mat-icon>
          <h3>No Tasks Found</h3>
          <p>You don't have any assigned tasks matching your filters.</p>
        </div>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding-bottom: 40px; }
    
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

    .tasks-table {
      width: 100%;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: var(--bg-tertiary);
    }

    .service-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 0;
    }

    .customer-name {
      font-size: 0.85rem;
      color: var(--primary-color);
      font-weight: 500;
    }

    .service-info small {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .status-action {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 280px;
    }

    .status-dropdown-field {
      flex: 1;
      margin: 0;
    }

    .update-btn {
      min-width: 110px;
      height: 40px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .update-btn mat-spinner {
      display: inline-block;
      margin-right: 4px;
    }

    ::ng-deep .status-dropdown-field .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    ::ng-deep .status-dropdown-field .mat-mdc-text-field-wrapper {
      background-color: transparent !important;
      padding: 0 8px !important;
    }

    ::ng-deep .status-dropdown-field .mat-mdc-form-field-flex {
      padding-top: 0 !important;
    }

    .location-info {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 250px;
    }

    .small-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-secondary);
    }
  `]
})
export class Tasks implements OnInit, AfterViewInit {
  tasks: any[] = [];
  originalTasks: any[] = [];
  displayedColumns = ['requestId', 'serviceName', 'workStatus', 'scheduledDate', 'address'];
  dataSource = new MatTableDataSource<any>([]);
  stats = { total: 0, assigned: 0, inProgress: 0, completed: 0 };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private technicianService: TechnicianService,
    private notify: NotifyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTasks(): void {
    this.technicianService.getMyTasks().subscribe({
      next: (tasks: any[]) => {
        // Initialize selectedStatus for each task
        this.tasks = tasks.map(task => ({
          ...task,
          selectedStatus: task.workStatus,
          updating: false
        }));
        this.originalTasks = this.tasks;
        this.dataSource.data = this.tasks;
        this.calculateStats();
      },
      error: (error: any) => {
        this.notify.error('Failed to load tasks');
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.tasks.length;
    this.stats.assigned = this.tasks.filter(t => t.workStatus === 'Assigned').length;
    this.stats.inProgress = this.tasks.filter(t => t.workStatus === 'InProgress').length;
    this.stats.completed = this.tasks.filter(t => t.workStatus === 'Completed').length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: string): void {
    if (status) {
      this.dataSource.data = this.originalTasks.filter(t => t.workStatus === status);
    } else {
      this.dataSource.data = this.originalTasks;
    }
  }

  confirmStatusUpdate(task: any): void {
    const statusLabels: any = {
      'Assigned': 'Assigned',
      'InProgress': 'In Progress',
      'Completed': 'Completed'
    };

    const confirmed = confirm(
      `Are you sure you want to update the status from "${statusLabels[task.workStatus]}" to "${statusLabels[task.selectedStatus]}"?\n\n` +
      `Request #${task.requestId} - ${task.serviceName}`
    );

    if (confirmed) {
      this.updateStatus(task, task.selectedStatus);
    } else {
      // Reset to original status
      task.selectedStatus = task.workStatus;
    }
  }

  updateStatus(task: any, newStatus: string): void {
    task.updating = true;

    this.technicianService.updateTaskStatus(task.assignmentId, newStatus).subscribe({
      next: () => {
        task.workStatus = newStatus;
        task.selectedStatus = newStatus;
        task.updating = false;
        this.calculateStats();

        // Show success notification
        this.snackBar.open(
          `✓ Status updated to "${this.getStatusLabel(newStatus)}" successfully!`,
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          }
        );
      },
      error: (err) => {
        task.updating = false;
        task.selectedStatus = task.workStatus; // Reset to original

        console.error('Error updating status:', err);
        this.snackBar.open(
          '✗ Failed to update status. Please try again.',
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'Assigned': 'Assigned',
      'InProgress': 'In Progress',
      'Completed': 'Completed'
    };
    return labels[status] || status;
  }
}
