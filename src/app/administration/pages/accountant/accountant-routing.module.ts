import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AccountantDashboardComponent } from './pages/accountant-dashboard/accountant-dashboard.component';
import { BuyVehiclesComponent } from './pages/buy-vehicles/buy-vehicles.component';

const routes: Routes = [
  { path: '', component: AccountantDashboardComponent },
  { path: 'vehicles', component: BuyVehiclesComponent },
  { path: '*', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountantRoutingModule { }
