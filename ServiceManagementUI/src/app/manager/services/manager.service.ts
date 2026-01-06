import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'https://localhost:7087/api/manager';

  constructor(private http: HttpClient) {}

  // Service Requests
  getServiceRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service-requests`);
  }

  getUnassignedRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service-requests/unassigned`);
  }

  // Assignments
  getAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assignments`);
  }

// Update manager.service.ts
assignTechnician(assignmentData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/assignments`, assignmentData);
}

  // Technicians
  getTechnicians(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/technicians`);
  }

  // Performance
  getTechnicianPerformance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/performance`);
  }

  getPerformanceStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/performance/stats`);
  }
}
