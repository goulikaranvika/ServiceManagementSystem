import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'https://localhost:7087/api/reports';

  constructor(private http: HttpClient) { }

  // Revenue Reports (Admin Only)
  getMonthlyRevenue(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/monthly-revenue/${year}`);
  }

  exportRevenueReport(year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/monthly-revenue/export/${year}`, { responseType: 'blob' });
  }

  // Service Reports (Admin & Manager)
  getServiceReport(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/services/${period}`);
  }

  exportServiceReport(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/services/export/${period}`, { responseType: 'blob' });
  }

  // Workload Reports (Admin & Manager)
  getWorkloadReport(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/technician-performance`);
  }

  exportWorkloadReport(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/technicians/export/${period}`, { responseType: 'blob' });
  }

  // Popular Services
  getPopularServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/popular-services`);
  }

  // Recent Feedback
  getRecentFeedback(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-feedback`);
  }
}

