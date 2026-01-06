import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7087/api';

  constructor(private http: HttpClient) {}

  // Users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
  }

  assignRole(userId: number, roleId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}/role`, { roleId });
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}/toggle-status`, {});
  }

  // Categories  
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/categories`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/categories`, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/categories/${id}`);
  }

  // Services
  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/services`);
  }

  createService(service: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/services`, service);
  }

  updateService(id: number, service: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/services/${id}`, service);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/services/${id}`);

  }

  // Add these methods to your existing AdminService
getReports(): Observable<any> {
  return this.http.get(`${this.apiUrl}/reports`);
}

}
