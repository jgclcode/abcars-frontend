import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AftersalesDashboardComponent } from './pages/aftersales-dashboard/aftersales-dashboard.component';
import { QuoteServiceComponent } from './pages/quote-service/quote-service.component';
import { QuoteHistoryComponent } from './components/quote-history/quote-history.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { IncidentsVehiclesComponent } from './pages/incidents-vehicles/incidents-vehicles.component';

const routes: Routes = [
  { path: '', component: AftersalesDashboardComponent },
  { path: 'citas-servicio', component: QuoteServiceComponent },
  { path: 'citas-servicio/historia/:client_id', component: QuoteHistoryComponent },
  { path: 'incidencias/servicios', component: IncidentsComponent },
  { path: 'incidencias/servicios', redirectTo: 'incidencias/servicios' },
  { path: 'incidencias/vehiculos', component: IncidentsVehiclesComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AftersalesRoutingModule { }
