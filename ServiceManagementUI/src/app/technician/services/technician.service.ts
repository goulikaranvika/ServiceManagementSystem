import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private apiUrl = 'https://localhost:7087/api/technician';

  constructor(private http: HttpClient) {}

  // Get my tasks (matches backend endpoint)
  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tasks`);
  }

  // Update task status (matches backend endpoint)
  updateTaskStatus(assignmentId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-task-status`, { 
      assignmentId, 
      status 
    });
  }

  // Get my performance (matches backend endpoint)
  getMyPerformance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-performance`);
  }
getMyFeedback(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/feedback`);
}
  // Remove all non-existent endpoints
  // These methods below don't exist in your backend, so remove them:
  // - getPendingAssignments()
  // - acceptTask()
  // - rejectTask()
  // - getAcceptedTasks()
  // - getTaskStats()
  // - getRecentFeedback()
}
