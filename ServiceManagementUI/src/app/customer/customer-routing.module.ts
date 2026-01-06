import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboard } from './customer-dashboard/customer-dashboard';
import { CreateRequests } from './service-request/create-requests/create-requests';
import { MyRequests } from './service-request/my-requests/my-requests';
import { SubmitFeedback } from './submit-feedback/submit-feedback';
import { InvoicesComponent } from './invoices/invoices';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: CustomerDashboard },
  { path: 'create-request', component: CreateRequests },
  { path: 'my-requests', component: MyRequests },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'feedback', component: SubmitFeedback }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }

