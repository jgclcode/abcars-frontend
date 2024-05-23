import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent} from './pages/dashboard/dashboard.component'
import { VehicleListComponent} from './pages/vehicles-list/vehicles-list.component'
import { DetailComponent } from './pages/vehicles-list/detail/detail.component'; 


import { FinancingFormComponent } from '../../../dashboard/pages/abc/components/financing-form/financing-form.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'vehicle-list', component: VehicleListComponent},
  { path: 'vehicle-list/detail/:vin', component: DetailComponent},
  { path: 'vehicle-list/financing/:vin/:userId', component: FinancingFormComponent},  
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
