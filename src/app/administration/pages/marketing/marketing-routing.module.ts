import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { MarketingDashboardComponent } from './pages/marketing-dashboard/marketing-dashboard.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';

const routes: Routes = [
  { path: '', component: MarketingDashboardComponent },
  { path: 'vehiculos', component: VehiclesComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MarketingRoutingModule { }
