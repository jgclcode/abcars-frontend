import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ValuatorDashboardComponent } from './pages/valuator-dashboard/valuator-dashboard.component';
import { SellYourCarsComponent } from './pages/sell-your-cars/sell-your-cars.component';
import { RequestSellCarComponent } from './pages/request-sell-car/request-sell-car.component';

const routes: Routes = [
  { path: '', component: ValuatorDashboardComponent },
  { path: 'requests/:id', component: RequestSellCarComponent},
  { path: 'vende-tu-auto', component: SellYourCarsComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ValuatorRoutingModule { }
