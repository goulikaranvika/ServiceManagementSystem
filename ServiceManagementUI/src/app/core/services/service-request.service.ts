import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../models/service-request.model';

@Injectable({
    providedIn: 'root'
})
export class ServiceRequestService {
    private apiUrl = 'https://localhost:7087/api/servicerequests';

    constructor(private http: HttpClient) { }

    createRequest(request: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, request);
    }

    getMyRequests(): Observable<ServiceRequest[]> {
        return this.http.get<ServiceRequest[]>(`${this.apiUrl}/my`);
    }

    getRequestStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`);
    }

    cancelRequest(id: number, reason: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, { cancelReason: reason });
    }
}
