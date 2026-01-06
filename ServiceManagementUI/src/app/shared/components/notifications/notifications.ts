import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../core/services/notification.service';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="notifications-container">
      <h2>Notifications</h2>
      <div *ngIf="notifications.length === 0" class="no-notifications">
        <mat-icon>notifications_none</mat-icon>
        <p>No notifications yet</p>
      </div>
      <div *ngFor="let notification of notifications" class="notification-card">
        <mat-card [class.unread]="!notification.isRead">
          <mat-card-header>
            <mat-card-title>{{notification.title}}</mat-card-title>
            <mat-card-subtitle>{{notification.createdAt | date:'short'}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{notification.message}}</p>
          </mat-card-content>
          <mat-card-actions *ngIf="!notification.isRead">
            <button mat-button (click)="markAsRead(notification.notificationId)">Mark as Read</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container { padding: 20px; }
    .notification-card { margin-bottom: 16px; }
    .unread { border-left: 4px solid #2196f3; }
    .no-notifications { text-align: center; padding: 40px; color: #666; }
    .no-notifications mat-icon { font-size: 48px; margin-bottom: 16px; }
  `]
})
export class Notifications implements OnInit {
  notifications: any[] = [];

  constructor(
    private notificationService: NotificationService,
    private notify: NotifyService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: () => {
        this.notify.error('Failed to load notifications');
      }
    });
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.loadNotifications();
        this.notificationService.updateUnreadCount();
        this.notify.success('Notification marked as read');
      },
      error: () => {
        this.notify.error('Failed to mark notification as read');
      }
    });
  }
}
