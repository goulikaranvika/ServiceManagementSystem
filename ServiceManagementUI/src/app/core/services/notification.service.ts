import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://localhost:7087/api/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);

  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-all-read`, {});
  }

  updateUnreadCount() {
    this.getUnreadCount().subscribe(response => {
      this.unreadCountSubject.next(response.count);
    });
  }
}

