import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, MatBadgeModule, RouterModule],
  styleUrls: ['./sidebar.css'],
  template: `
    <mat-nav-list>
      <!-- Notifications for non-admin users only -->
      <a mat-list-item routerLink="/notifications" routerLinkActive="active" *ngIf="userRole !== 'Admin' && userRole !== 'ServiceManager'">
        <mat-icon [matBadge]="unreadCount" matBadgeColor="warn" [matBadgeHidden]="unreadCount === 0">notifications</mat-icon>
        <span>Notifications</span>
      </a>
      
      <ng-container [ngSwitch]="userRole">
        <!-- Admin Menu -->
        <div *ngSwitchCase="'Admin'">
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span>Manage Users</span>
          </a>
          <a mat-list-item routerLink="/admin/categories" routerLinkActive="active">
            <mat-icon>category</mat-icon>
            <span>Categories</span>
          </a>
          <a mat-list-item routerLink="/admin/services" routerLinkActive="active">
            <mat-icon>build</mat-icon>
            <span>Services</span>
          </a>
          <a mat-list-item routerLink="/admin/reports" routerLinkActive="active">
            <mat-icon>analytics</mat-icon>
            <span>Reports</span>
          </a>
        </div>

        <!-- Manager Menu -->
        <div *ngSwitchCase="'ServiceManager'">
          <a mat-list-item routerLink="/manager/service-requests" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            <span>Service Requests</span>
          </a>
          <a mat-list-item routerLink="/manager/assignments" routerLinkActive="active">
            <mat-icon>assignment_ind</mat-icon>
            <span>Assignments</span>
          </a>
          <a mat-list-item routerLink="/manager/performance" routerLinkActive="active">
            <mat-icon>analytics</mat-icon>
            <span>Performance</span>
          </a>
        </div>

        <!-- Technician Menu -->
        <div *ngSwitchCase="'Technician'">
          <a mat-list-item routerLink="/technician/tasks" routerLinkActive="active">
            <mat-icon>task</mat-icon>
            <span>My Tasks</span>
          </a>
          <a mat-list-item routerLink="/technician/performance" routerLinkActive="active">
            <mat-icon>trending_up</mat-icon>
            <span>Performance</span>
          </a>
        </div>

        <!-- Customer Menu -->
<div *ngSwitchCase="'Customer'">
  <a mat-list-item routerLink="/customer/dashboard" routerLinkActive="active">
    <mat-icon>dashboard</mat-icon>
    <span>Dashboard</span>
  </a>
  <a mat-list-item routerLink="/customer/create-request" routerLinkActive="active">
    <mat-icon>add_circle</mat-icon>
    <span>Create Request</span>
  </a>
  <a mat-list-item routerLink="/customer/my-requests" routerLinkActive="active">
    <mat-icon>list</mat-icon>
    <span>My Requests</span>
  </a>
  <a mat-list-item routerLink="/customer/invoices" routerLinkActive="active">
    <mat-icon>receipt</mat-icon>
    <span>My Invoices</span>
  </a>
</div>

      </ng-container>
    </mat-nav-list>
  `
})
export class Sidebar implements OnInit {
  userRole: string;
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit() {
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    this.notificationService.updateUnreadCount();
  }
}
