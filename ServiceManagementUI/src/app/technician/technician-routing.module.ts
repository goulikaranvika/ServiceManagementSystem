import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tasks } from './tasks/tasks';
import { Performance } from './performance/performance';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: Tasks },
  { path: 'performance', component: Performance }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnicianRoutingModule { }
