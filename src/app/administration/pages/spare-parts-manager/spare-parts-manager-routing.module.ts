import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SparePartsManagerDashboardComponent } from './pages/spare-parts-manager-dashboard/spare-parts-manager-dashboard.component';
import { SparePartsAdministrationComponent } from './pages/spare-parts-administration/spare-parts-administration.component';
import { SparePartsEditComponent } from './components/spare-parts-edit/spare-parts-edit.component';
import { RequestSellCarComponent } from '../valuator/pages/request-sell-car/request-sell-car.component';
import { SparePartsManagerPrintValuationComponent } from './components/spare-parts-manager-print-valuation/spare-parts-manager-print-valuation.component';
import { ClientPriceOfferComponent } from './pages/ClientPriceOffer/ClientPriceOffer.component';

const routes: Routes = [
  { path: '', component: SparePartsManagerDashboardComponent },
  { path: 'vehicles', component: SparePartsAdministrationComponent },
  { path: 'print-valuation', component: SparePartsManagerPrintValuationComponent },
  { path: 'client-price-offer', component: ClientPriceOfferComponent },
  { path: 'vehicles/edit/:id', component: SparePartsEditComponent },
  { path: 'valuation/edit/:id', component: RequestSellCarComponent },
  { path: '', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SparePartsManagerRoutingModule { }
