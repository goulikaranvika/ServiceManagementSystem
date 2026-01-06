import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NotificationBellComponent
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="navbar-content">
        <div class="brand">
          <mat-icon class="brand-icon">home_repair_service</mat-icon>
          <span class="brand-name">Service Management</span>
        </div>
        
        <div class="navbar-actions">
          <!-- Notification Bell -->
          <app-notification-bell></app-notification-bell>
          
          <!-- User Menu -->
          <button mat-button [matMenuTriggerFor]="menu" class="user-button">
            <mat-icon>account_circle</mat-icon>
            <span class="user-text">Profile</span>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .brand-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .brand-name,
      .user-text {
        display: none;
      }
    }
  `]
})
export class Navbar {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
