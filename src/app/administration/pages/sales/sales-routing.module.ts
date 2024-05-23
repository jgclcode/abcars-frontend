import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SalesDashboardComponent } from './pages/sales-dashboard/sales-dashboard.component';
import { FindmeVehicleComponent } from './pages/findme-vehicle/findme-vehicle.component';
import { ChoicesComponent } from './pages/choices/choices.component';
import { FinancingsComponent } from './pages/financings/financings.component';

const routes: Routes = [
  { path: '', component: SalesDashboardComponent },
  { path: 'buscame-un-auto', component: FindmeVehicleComponent },
  { path: 'reservados', component: ChoicesComponent },
  { path: 'financiamiento', component: FinancingsComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SalesRoutingModule { }
