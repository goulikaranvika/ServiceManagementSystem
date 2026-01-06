import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private apiUrl = 'https://localhost:7087/api/billing';

  constructor(private http: HttpClient) {}

  // Invoices
  getMyInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invoices`);
  }

  getInvoiceStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/invoices/stats`);
  }

  downloadInvoice(invoiceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/invoices/${invoiceId}/download`, { responseType: 'blob' });
  }

  // Payments
  makePayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments`, paymentData);
  }

  getMyPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments`);
  }

  getPaymentStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/stats`);
  }

  downloadReceipt(paymentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/${paymentId}/receipt`, { responseType: 'blob' });
  }
}

