import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../../core/services/notification.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-notification-bell',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        MatMenuModule,
        MatListModule,
        MatDividerModule
    ],
    template: `
    <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-button">
      <mat-icon [matBadge]="unreadCount" [matBadgeHidden]="unreadCount === 0" matBadgeColor="warn">
        notifications
      </mat-icon>
    </button>

    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="notification-header" (click)="$event.stopPropagation()">
        <h3>Notifications</h3>
        <button mat-button (click)="markAllAsRead()" *ngIf="unreadCount > 0">
          Mark all read
        </button>
      </div>
      <mat-divider></mat-divider>

      <div class="notification-list" *ngIf="notifications.length > 0">
        <mat-list>
          <mat-list-item 
            *ngFor="let notification of notifications" 
            [class.unread]="!notification.isRead"
            (click)="markAsRead(notification)">
            <div class="notification-item">
              <mat-icon [ngClass]="getNotificationIcon(notification.type).class">
                {{getNotificationIcon(notification.type).icon}}
              </mat-icon>
              <div class="notification-content">
                <strong>{{notification.title}}</strong>
                <p>{{notification.message}}</p>
                <small>{{notification.createdDate | date:'short'}}</small>
              </div>
            </div>
          </mat-list-item>
        </mat-list>
      </div>

      <div class="empty-notifications" *ngIf="notifications.length === 0" (click)="$event.stopPropagation()">
        <mat-icon>notifications_none</mat-icon>
        <p>No notifications</p>
      </div>
    </mat-menu>
  `,
    styles: [`
    .notification-button {
      margin: 0 8px;
    }

    ::ng-deep .notification-menu {
      min-width: 380px;
      max-width: 400px;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-primary);
    }

    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .notification-item:hover {
      background-color: var(--bg-secondary);
    }

    mat-list-item.unread {
      background-color: var(--bg-tertiary);
    }

    .notification-item mat-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .notification-item mat-icon.success {
      background: #e8f5e9;
      color: #4caf50;
    }

    .notification-item mat-icon.info {
      background: #e3f2fd;
      color: #2196f3;
    }

    .notification-item mat-icon.warning {
      background: #fff3e0;
      color: #ff9800;
    }

    .notification-item mat-icon.error {
      background: #ffebee;
      color: #f44336;
    }

    .notification-content {
      flex: 1;
    }

    .notification-content strong {
      display: block;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .notification-content p {
      margin: 0 0 4px 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .notification-content small {
      color: var(--text-light);
      font-size: 0.75rem;
    }

    .empty-notifications {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-secondary);
    }

    .empty-notifications mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--text-light);
      margin-bottom: 8px;
    }
  `]
})
export class NotificationBellComponent implements OnInit, OnDestroy {
    notifications: any[] = [];
    unreadCount = 0;
    private pollingSubscription?: Subscription;

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.loadNotifications();
        this.startPolling();
    }

    ngOnDestroy(): void {
        this.pollingSubscription?.unsubscribe();
    }

    loadNotifications(): void {
        this.notificationService.getNotifications().subscribe({
            next: (notifications) => {
                this.notifications = notifications.slice(0, 10); // Show last 10
                this.unreadCount = notifications.filter(n => !n.isRead).length;
            },
            error: () => { }
        });
    }

    startPolling(): void {
        // Poll every 30 seconds for new notifications
        this.pollingSubscription = interval(30000)
            .pipe(switchMap(() => this.notificationService.getNotifications()))
            .subscribe({
                next: (notifications) => {
                    const newUnreadCount = notifications.filter(n => !n.isRead).length;
                    if (newUnreadCount > this.unreadCount) {
                        // Play notification sound or show toast
                        this.playNotificationSound();
                    }
                    this.notifications = notifications.slice(0, 10);
                    this.unreadCount = newUnreadCount;
                },
                error: () => { }
            });
    }

    markAsRead(notification: any): void {
        if (!notification.isRead) {
            this.notificationService.markAsRead(notification.notificationId).subscribe({
                next: () => {
                    notification.isRead = true;
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                },
                error: () => { }
            });
        }
    }

    markAllAsRead(): void {
        this.notificationService.markAllAsRead().subscribe({
            next: () => {
                this.notifications.forEach(n => n.isRead = true);
                this.unreadCount = 0;
            },
            error: () => { }
        });
    }

    getNotificationIcon(type: string): { icon: string, class: string } {
        const icons: { [key: string]: { icon: string, class: string } } = {
            'ServiceRequestAssigned': { icon: 'assignment_turned_in', class: 'info' },
            'TaskAssigned': { icon: 'task_alt', class: 'info' },
            'PaymentSuccess': { icon: 'payment', class: 'success' },
            'ServiceCompleted': { icon: 'check_circle', class: 'success' },
            'InvoiceGenerated': { icon: 'receipt', class: 'warning' },
            'StatusUpdate': { icon: 'update', class: 'info' }
        };
        return icons[type] || { icon: 'notifications', class: 'info' };
    }

    playNotificationSound(): void {
        // Optional: Play a subtle notification sound
        const audio = new Audio('assets/sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => { }); // Ignore errors if sound file doesn't exist
    }
}
