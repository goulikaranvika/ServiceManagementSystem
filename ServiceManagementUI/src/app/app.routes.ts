import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LandingComponent } from './landing/landing';
import { roleGuard } from './core/guards/role-guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Users } from './admin/users/users';
import { Categories } from './admin/categories/categories';
import { Services } from './admin/service/service';
import { CustomerDashboard } from './customer/customer-dashboard/customer-dashboard';
import { CreateRequests } from './customer/service-request/create-requests/create-requests';
import { MyRequests } from './customer/service-request/my-requests/my-requests';
import { SubmitFeedback } from './customer/submit-feedback/submit-feedback';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized';
import { ServiceReport } from './reports/service-report/service-report';
import { MonthlyRevenue } from './reports/revenue/montly-revenue/montly-revenue';
import { ServiceRequests } from './manager/service-requests/service-requests';
import { Assignments } from './manager/assignments/assignments';
import { Performance } from './manager/performance/performance';
import { Tasks } from './technician/tasks/tasks';
import { Performance as TechPerformance } from './technician/performance/performance';
import { InvoiceList } from './billing/invoices/invoice-list/invoice-list';
import { Payment } from './billing/payments/payment/payment';
import { WorkloadReport } from './reports/technician/workload-report/workload-report';
import { Notifications } from './shared/components/notifications/notifications';
import { InvoicesComponent } from './customer/invoices/invoices';



export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'landing', component: LandingComponent },

  { path: 'notifications', component: Notifications, canActivate: [authGuard] },


  // Auth routes
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },

  // Admin routes
  {
    path: 'admin/users',
    component: Users,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/categories',
    component: Categories,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/services',
    component: Services,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/reports/service',
    component: ServiceReport,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/reports/revenue',
    component: MonthlyRevenue,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  { path: 'admin/reports', redirectTo: '/admin/reports/service', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/users', pathMatch: 'full' },



  // Manager routes
  {
    path: 'manager/service-requests',
    component: ServiceRequests,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ServiceManager' }
  },
  {
    path: 'manager/assignments',
    component: Assignments,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ServiceManager' }
  },
  {
    path: 'manager/performance',
    component: Performance,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ServiceManager' }
  },
  { path: 'manager', redirectTo: '/manager/service-requests', pathMatch: 'full' },

  //Technician
  // Add these technician routes to app.routes.ts
  {
    path: 'technician/tasks',
    component: Tasks,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Technician' }
  },
  {
    path: 'technician/performance',
    component: TechPerformance,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Technician' }
  },
  { path: 'technician', redirectTo: '/technician/tasks', pathMatch: 'full' },




  // Customer routes
  {
    path: 'customer/dashboard', component: CustomerDashboard, canActivate: [authGuard, roleGuard],
    data: { role: 'Customer' }
  },
  {
    path: 'customer/create-request', component: CreateRequests, canActivate: [authGuard, roleGuard],
    data: { role: 'Customer' }
  },
  {
    path: 'customer/my-requests', component: MyRequests, canActivate: [authGuard, roleGuard],
    data: { role: 'Customer' }
  },
  {
    path: 'customer/feedback', component: SubmitFeedback, canActivate: [authGuard, roleGuard],
    data: { role: 'Customer' }
  },
  {
    path: 'customer/invoices', component: InvoicesComponent, canActivate: [authGuard, roleGuard],
    data: { role: 'Customer' }
  },
  { path: 'customer', redirectTo: '/customer/dashboard', pathMatch: 'full' },
  {
    path: 'customer/payments',
    component: Payment,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Customer' }
  },

  //billing
  // Add these billing routes to app.routes.ts
  {
    path: 'billing/invoices',
    component: InvoiceList,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'ServiceManager'] }
  },
  {
    path: 'billing/payments',
    component: Payment,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Customer'] }
  },
  { path: 'billing', redirectTo: '/billing/invoices', pathMatch: 'full' },


  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/auth/login' }
];
