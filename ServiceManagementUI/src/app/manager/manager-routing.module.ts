import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceRequests } from './service-requests/service-requests';
import { Assignments } from './assignments/assignments';
import { Performance } from './performance/performance';

const routes: Routes = [
  { path: '', redirectTo: 'service-requests', pathMatch: 'full' },
  { path: 'service-requests', component: ServiceRequests },
  { path: 'assignments', component: Assignments },
  { path: 'performance', component: Performance }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
