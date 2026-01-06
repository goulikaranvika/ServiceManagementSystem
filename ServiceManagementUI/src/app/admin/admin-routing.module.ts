import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Users } from './users/users';
import { Categories } from './categories/categories';

import {Services} from './service/service'

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: Users },
  { path: 'categories', component: Categories },
  { path: 'services', component: Services }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
