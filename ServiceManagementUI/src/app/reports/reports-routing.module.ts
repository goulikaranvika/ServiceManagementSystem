import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyRevenue } from './revenue/montly-revenue/montly-revenue';
import { ServiceReport } from './service-report/service-report';
import { WorkloadReport } from './technician/workload-report/workload-report';
import { roleGuard } from '../core/guards/role-guard';

const routes: Routes = [
  { path: '', redirectTo: 'services', pathMatch: 'full' },
  { 
    path: 'revenue', 
    component: MonthlyRevenue,
    canActivate: [roleGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'services', 
    component: ServiceReport,
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'ServiceManager'] }
  },
  { 
    path: 'technicians', 
    component: WorkloadReport,
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'ServiceManager'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
