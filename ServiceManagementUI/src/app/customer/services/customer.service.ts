import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://localhost:7087/api';

  constructor(private http: HttpClient) {}

  // Catalog - Fixed URLs
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalog/categories`);
  }

  getServicesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalog/categories/${categoryId}/services`);
  }

  // Add missing method
  getFeaturedServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalog/services`);
  }

  // Service Requests - Fixed URLs
  createServiceRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/servicerequests`, requestData);
  }

  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicerequests/my`);
  }

  // Add missing method
  getCompletedRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicerequests/my`);
  }

  getRequestStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/servicerequests/stats`);
  }

  cancelRequest(requestId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/servicerequests/${requestId}/cancel`, {});
  }

  // Feedback
  submitFeedback(feedbackData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/feedback`, feedbackData);
  }
}
