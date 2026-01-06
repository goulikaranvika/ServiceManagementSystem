import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../services/admin.service';
import { NotifyService } from '../../core/services/notify.service';
import { RoleDialog } from '../role-dialog/role-dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatChipsModule, MatTooltipModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>User Management</h1>
        <p>Manage system users, roles, and account statuses</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{users.length}}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>how_to_reg</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{activeCount}}</h3>
            <p>Active Accounts</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>admin_panel_settings</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{adminCount}}</h3>
            <p>Administrators</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>engineering</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{techCount}}</h3>
            <p>Technicians</p>
          </div>
        </div>
      </div>

      <!-- Filters & Content -->
      <div class="content-card">
        <div class="content-card-header">
          <h3>Registered Users</h3>
          <div class="header-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search Users</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or email...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="modern-table">
          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Full Name</th>
            <td mat-cell *matCellDef="let user">
              <div class="user-cell">
                <strong>{{user.fullName}}</strong>
                <small>{{user.email}}</small>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let user">{{user.email}}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
            <td mat-cell *matCellDef="let user">
              <span class="role-badge" [ngClass]="'role-' + user.role?.roleName?.toLowerCase()">
                {{user.role?.roleName || 'No Role'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let user">
              <span class="status-badge" [ngClass]="user.isActive ? 'status-active' : 'status-inactive'">
                {{user.isActive ? 'Active' : 'Inactive'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="primary" (click)="updateRole(user)" matTooltip="Update Role">
                <mat-icon>admin_panel_settings</mat-icon>
              </button>
              <button mat-icon-button [color]="user.isActive ? 'warn' : 'primary'" (click)="toggleStatus(user)" 
                      [matTooltip]="user.isActive ? 'Deactivate User' : 'Activate User'">
                <mat-icon>{{user.isActive ? 'person_off' : 'person_add'}}</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
        </table>

        <div *ngIf="dataSource.data.length === 0" class="empty-state">
          <mat-icon>person_search</mat-icon>
          <h3>No Users Found</h3>
          <p>We couldn't find any users matching your criteria.</p>
        </div>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .search-field {
      width: 300px;
      margin-bottom: -15px;
    }

    .user-cell {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }

    .user-cell small {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .role-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
    }

    .role-admin { border-color: #f44336; color: #f44336; }
    .role-servicemanager { border-color: #1976d2; color: #1976d2; }
    .role-technician { border-color: #ff9800; color: #ff9800; }
    .role-customer { border-color: #4caf50; color: #4caf50; }

    .status-active { background: #e8f5e9; color: #2e7d32; }
    .status-inactive { background: #ffeea1; color: #8a6d3b; }

    @media (max-width: 768px) {
      .search-field {
        width: 100%;
      }
    }
  `]
})
export class Users implements OnInit, AfterViewInit {
  users: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['fullName', 'email', 'role', 'status', 'actions'];

  activeCount = 0;
  adminCount = 0;
  techCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private notify: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.dataSource.data = users;
        this.calculateStats();
      },
      error: () => this.notify.error('Failed to load users')
    });
  }

  calculateStats(): void {
    this.activeCount = this.users.filter(u => u.isActive).length;
    this.adminCount = this.users.filter(u => u.role?.roleName === 'Admin').length;
    this.techCount = this.users.filter(u => u.role?.roleName === 'Technician').length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateRole(user: any): void {
    const dialogRef = this.dialog.open(RoleDialog, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(roleId => {
      if (roleId) {
        this.adminService.assignRole(user.userId, roleId).subscribe({
          next: () => {
            this.notify.success('Role assigned successfully');
            this.loadUsers();
          },
          error: () => this.notify.error('Failed to assign role')
        });
      }
    });
  }

  toggleStatus(user: any): void {
    this.adminService.toggleUserStatus(user.userId).subscribe({
      next: () => {
        user.isActive = !user.isActive;
        this.calculateStats();
        this.notify.success(`User ${user.isActive ? 'activated' : 'deactivated'} successfully`);
      },
      error: () => this.notify.error('Failed to update user status')
    });
  }
}
