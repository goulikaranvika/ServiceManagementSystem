import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceList } from './invoices/invoice-list/invoice-list';
import { Payment } from './payments/payment/payment';

const routes: Routes = [
  { path: '', redirectTo: 'invoices', pathMatch: 'full' },
  { path: 'invoices', component: InvoiceList },
  { path: 'payments', component: Payment }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
