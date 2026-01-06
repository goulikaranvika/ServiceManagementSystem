import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BillingService {
    private apiUrl = 'https://localhost:7087/api/billing';

    constructor(private http: HttpClient) { }

    getMyInvoices(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/invoices`);
    }

    getInvoiceByRequest(requestId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/request/${requestId}`);
    }

    getMyPayments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/payments`);
    }

    getPaymentStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/payments/stats`);
    }

    confirmPayment(invoiceId: number, paidAmount: number, paymentMode: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/pay`, {
            invoiceId,
            paidAmount,
            paymentMode
        });
    }
}
